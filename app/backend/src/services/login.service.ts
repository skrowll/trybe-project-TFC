import { IUser } from '../interfaces/IUser';
import UserModel from '../database/models/user.model';

export default class LoginService {
  userModel = UserModel;

  public login = async (email: string): Promise<IUser | null> => {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  };
}
