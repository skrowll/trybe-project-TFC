// import { IUser } from '../interfaces/IUser';
import APIError from '../helpers/error.helper';
import User from '../database/models/user.model';
import checkPassword from './password.service';
import * as jwtService from './jwt.service';

export default class LoginService {
  userModel = User;

  public login = async (email: string, password: string) => {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new APIError(401, 'Incorrect email or password');
    }
    checkPassword(password, user.password);
    const token = jwtService.createToken({
      email,
      password,
    });
    return { token };
  };
}
