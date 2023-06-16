import { NextFunction, Request, Response } from 'express';
import APIError from '../helpers/error.helper';

const checkTokenExist = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new APIError(401, 'Token not found');
  }
  next();
};

export default checkTokenExist;
