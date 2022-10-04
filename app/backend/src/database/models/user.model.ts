import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';

class User extends Model {
  id?: number;
  username: string;
  role: string;
  email: string;
  password: string;
}

User.init({
  id: {
    primaryKey: true,
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  username: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'users',
});

export default User;
