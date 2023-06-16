import { NextFunction, Request, Response } from 'express';
import APIError from '../helpers/error.helper';
import { validateToken } from '../services/jwt.service';

const validateRole = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    const { role } = validateToken(token as string);
    if (role !== 'admin') {
      throw new APIError(401, 'You must be an Admin');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validateRole;
