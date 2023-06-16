import * as jwt from 'jsonwebtoken';
import APIError from '../helpers/error.helper';
import 'dotenv/config';

export const createToken = (payload: object): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
  return token;
};

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as jwt.JwtPayload;
  } catch (error) {
    throw new APIError(401, 'Token must be a valid token');
  }
};
