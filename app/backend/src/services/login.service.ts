// import { IUser } from '../interfaces/IUser';
import APIError from '../helpers/error.helper';
import User from '../database/models/user.model';
import checkPassword from './password.service';
import * as jwtService from './jwt.service';
import validateLogin from '../middlewares/login.middleware';

export default class LoginService {
  userModel = User;

  public login = async (email: string, password: string) => {
    validateLogin(email, password);
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new APIError(401, 'Incorrect email or password');
    }
    checkPassword(password, user.password);
    const token = jwtService.createToken({
      user,
    });
    return { token };
  };
}
