import APIError from '../helpers/error.helper';

const validateLogin = (email: string, password: string) => {
  if (!email || !password) {
    throw new APIError(400, 'All fields must be filled');
  }
};

export default validateLogin;
