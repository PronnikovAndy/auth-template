import express, { Application, Request, Response, NextFunction } from "express";
import { createConnection } from "typeorm";
import bodyParser from "body-parser";
import { IController } from "./interfaces";
import { POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_PASSWORD, POSTGRES_USERNAME, APP_PORT } from "../config";
import { initUser } from './seeds';
import { HttpException } from "./exceptions";
import { User } from "./entities";

class App {
  public app: Application;

  constructor(controllers: IController[]) {
    this.app = express();

    this.connectToTheDatabase().then(() => {
      this.initializeDataBase();
    });
    this.initializeHeaders();
    this.initializeMiddleware();
    this.initializeStatics();
    this.initializeControllers(controllers);
  }

  private async connectToTheDatabase() {
    try {
      await createConnection({
        type: 'postgres',
        host: POSTGRES_HOST,
        port: (POSTGRES_PORT || 5432) as number,
        username: POSTGRES_USERNAME,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DATABASE,
        entities: [
          User
        ],
        synchronize: true,
        logging: false
      });
    } catch (error) {
      console.log('Connection unsuccessful', error);
    }
  }

  private async initializeDataBase() {
    console.log("Start seed tasks")
    await initUser();
    console.log("Finish seed tasks")
  }

  private initializeHeaders() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PATCH');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Tus-Resumable, Upload-Length, Upload-Metadata, Upload-Offset');

      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
    this.app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
      const status: number = error.status || 500;
      const message: string = error.message || 'Something went wrong';
    
      res
        .status(status)
        .send({
          status,
          message
        });
    });
  }

  private initializeStatics() {
    this.app.use(express.static('public'));
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach(controller => {
      this.app.use('/api', controller.router);
    });
  }

  public listen() {
    this.app.listen(APP_PORT || 3000, () => {
      console.log(`🚀 REST server is running on http://localhost:${APP_PORT}/`)
    });
  }
}

export default App;