import { Request, Response, NextFunction } from 'express';
import APIError from '../helpers/error.helper';

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new APIError(400, 'All fields must be filled'));
  }
  return next();
};

export default validateLogin;
