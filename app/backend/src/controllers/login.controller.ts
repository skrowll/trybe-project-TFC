import { Request, Response, NextFunction } from 'express';
import LoginService from '../services/login.service';

export default class UserController {
  loginService = new LoginService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await this.loginService.login(email);
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      next();
    }
  };
}
