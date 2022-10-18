import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import APIError from '../helpers/error.helper';

const JWT_SECRET = 'jwt_secret';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new APIError(401, 'Token not found');
  }
  try {
    jwt.verify(authorization, JWT_SECRET);
  } catch (error) {
    console.log(error);
    throw new APIError(401, 'Invalid token');
  }
  next();
};

export default validateToken;
