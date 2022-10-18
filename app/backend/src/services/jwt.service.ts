import * as jwt from 'jsonwebtoken';
import APIError from '../helpers/error.helper';

const JWT_SECRET = 'jwt_secret';

export const createToken = (payload: object): string => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
  return token;
};

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as jwt.JwtPayload;
  } catch (error) {
    throw new APIError(401, 'Token must be a valid token');
  }
};
