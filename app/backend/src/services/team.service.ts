import APIError from '../helpers/error.helper';
import Team from '../database/models/team.model';

export default class LoginService {
  teamModel = Team;

  public list = async () => {
    const allTeams = await this.teamModel.findAll();
    if (!allTeams) {
      throw new APIError(404, 'Not found');
    }
    return allTeams;
  };

  public findById = async (id: number) => {
    const team = await this.teamModel.findByPk(id);
    if (!team) {
      throw new APIError(404, 'Not found');
    }
    return team;
  };
}
