import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // const { code } = error;
  // const { message } = error;
  const { code } = error || 500;
  const { message } = error || 'Internal server error';
  return res.status(code).json({ message });
};

export default errorMiddleware;
