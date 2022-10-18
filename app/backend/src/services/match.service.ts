import APIError from '../helpers/error.helper';
import Match from '../database/models/match.model';
import Team from '../database/models/team.model';
import { IMatch } from '../interfaces/IMatch';

export default class LoginService {
  matchModel = Match;
  teamModel = Team;

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

  public createNewMatch = async (match: IMatch) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = match;

    const homeTeamExists = await this.teamModel.findByPk(homeTeam);
    const awayTeamExists = await this.teamModel.findByPk(awayTeam);

    if (homeTeam === awayTeam) {
      throw new APIError(401, 'It is not possible to create a match with two equal teams');
    }
    if (!homeTeamExists || !awayTeamExists) {
      throw new APIError(404, 'There is no team with such id!');
    }

    const createdMatch = await this.matchModel.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });

    return createdMatch;
  };

  public finishMatch = async (id: number) => {
    const updatedMatch = await this.matchModel.update({ inProgress: false }, { where: { id } });
    if (!updatedMatch) {
      throw new APIError(404, 'Not found');
    }
    return { message: 'Finished' };
  };

  public updateGoals = async (id: number, homeTeamGoals: number, awayTeamGoals: number) => {
    const updatedMatchGoals = await this.matchModel.update({
      homeTeamGoals, awayTeamGoals,
    }, { where: { id } });
    if (!updatedMatchGoals) {
      throw new APIError(404, 'Not found');
    }
    return { message: 'Updated' };
  };
}
