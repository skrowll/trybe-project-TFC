import { NextFunction, Request, Response } from 'express';
import APIError from '../helpers/error.helper';

const validateLogin = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new APIError(400, 'All fields must be filled');
  }
  next();
};

export default validateLogin;
