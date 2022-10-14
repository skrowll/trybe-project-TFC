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
    console.log('===============================TOKEN2==========================');
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('===============================decoded==========================');
    console.log(decoded);
    return decoded as jwt.JwtPayload;
  } catch (error) {
    throw new APIError(401, 'Invalid token');
  }
};
