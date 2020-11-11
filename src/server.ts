import dotenv from 'dotenv';

import App from './app';
import { AuthController } from './app/controllers';

dotenv.config();

const app = new App([new AuthController()]);

app.listen();