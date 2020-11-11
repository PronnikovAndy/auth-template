import { Router, Request, Response, NextFunction } from "express";
import { IController } from "../interfaces";
import UserService from "../services/user.service";

class AuthController implements IController {
  public path = "/auth";
  public router = Router();
  private userService: UserService;

  constructor() {
    this.initializeRoutes();
    this.userService = new UserService();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      this.login);
    this.router.post(
      `${this.path}/signup`,
      this.signup);
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.loginUser(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.createUser(req.body);

      res.status(200).json({
        message: "Ok"
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;