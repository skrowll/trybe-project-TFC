import * as bcrypt from 'bcryptjs';
import APIError from '../helpers/error.helper';

const checkPassword = (password: string, passwordDb: string) => {
  const isMatch = bcrypt.compareSync(password, passwordDb);
  if (!isMatch) {
    throw new APIError(401, 'Incorrect email or password');
  }
};

export default checkPassword;
