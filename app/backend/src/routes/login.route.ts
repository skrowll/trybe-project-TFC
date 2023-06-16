import { Router } from 'express';
import LoginController from '../controllers/login.controller';
import validateLogin from '../middlewares/login.middleware';
import checkTokenExist from '../middlewares/token.middleware';

const loginRouter = Router();
const loginController = new LoginController();

loginRouter.post('/', validateLogin, loginController.login);
loginRouter.get('/validate', checkTokenExist, loginController.validate);

export default loginRouter;
