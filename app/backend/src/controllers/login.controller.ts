import { Request, Response, NextFunction } from 'express';
import LoginService from '../services/login.service';
import * as jwtService from '../services/jwt.service';
import APIError from '../helpers/error.helper';

export default class UserController {
  loginService = new LoginService();

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.loginService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public validate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) throw new APIError(401, 'Invalid token');
      const { role } = jwtService.validateToken(token);
      return res.status(200).json({ role });
    } catch (error) {
      next(error);
    }
  };
}
