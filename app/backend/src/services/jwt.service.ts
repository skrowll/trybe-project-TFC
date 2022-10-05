import * as jwt from 'jsonwebtoken';

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
    const data = jwt.verify(token, JWT_SECRET);
    return data;
  } catch (error) {
    throw new Error('Expired or invalid token');
  }
};
