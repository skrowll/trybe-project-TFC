import APIError from '../helpers/error.helper';
import Match from '../database/models/match.model';
import Team from '../database/models/team.model';

export default class LoginService {
  matchModel = Match;

  public list = async () => {
    const allMatches = await this.matchModel.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    if (!allMatches) {
      throw new APIError(404, 'Not found');
    }
    return allMatches;
  };

  public listAllInProgress = async (query: boolean) => {
    const allMatchesInProgress = await this.matchModel.findAll({ where: { inProgress: query },
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    if (!allMatchesInProgress) {
      throw new APIError(404, 'Not found');
    }
    return allMatchesInProgress;
  };
}
