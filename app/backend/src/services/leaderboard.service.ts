import APIError from '../helpers/error.helper';
import Match from '../database/models/match.model';
import Team from '../database/models/team.model';
import { ILeaderboard } from '../interfaces/ILeaderboard';
import { IMatch } from '../interfaces/IMatch';

export default class LeaderboardService {
  matchModel = Match;
  teamModel = Team;

  public getHomeMatches = async () => {
    const matches = await this.matchModel.findAll({
      where: { inProgress: false },
      include: [{
        model: Team,
        as: 'teamHome',
        attributes: ['teamName'],
      }],
    }) as IMatch[];

    if (!matches) {
      throw new APIError(404, 'Not found');
    };

    const homeMatches = LeaderboardService.createHomeMatches(matches);
    const sumMatches = LeaderboardService.accMatches(homeMatches);
    const leaderboard = LeaderboardService.completeLeaderboard(sumMatches);
    return leaderboard;
  };

  public getAwayMatches = async () => {
    const matches = await this.matchModel.findAll({
      where: { inProgress: false },
      include: [{
        model: Team,
        as: 'teamAway',
        attributes: ['teamName'],
      }],
    }) as IMatch[];

    if (!matches) {
      throw new APIError(404, 'Not found');
    };

    const awayMatches = LeaderboardService.createAwayMatches(matches);
    const sumMatches = LeaderboardService.accMatches(awayMatches);
    const leaderboard = LeaderboardService.completeLeaderboard(sumMatches);
    return leaderboard;
  };

  public getAllMatches = async () => {
    const matches = await this.matchModel.findAll({
      where: { inProgress: false },
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    }) as IMatch[];

    if (!matches) {
      throw new APIError(404, 'Not found');
    };

    const homeMatches = LeaderboardService.createHomeMatches(matches);
    const awayMatches = LeaderboardService.createAwayMatches(matches);
    const sumMatches = LeaderboardService.accMatches([...homeMatches, ...awayMatches]);
    const leaderboard = LeaderboardService.completeLeaderboard(sumMatches);
    return leaderboard;
  };

  static createHomeMatches(matches: any[]) {
    return matches.map((match) => {
      let acc = { points: 0, win: 0, draw: 0, loss: 0 };
      if (match.homeTeamGoals === match.awayTeamGoals) {
        acc = { ...acc, points: 1, draw: 1 };
      } else if (match.homeTeamGoals > match.awayTeamGoals) {
        acc = { ...acc, points: 3, win: 1 };
      } else { acc = { ...acc, loss: 1 }; }
      return {
        name: match.teamHome.teamName,
        totalPoints: acc.points,
        totalVictories: acc.win,
        totalDraws: acc.draw,
        totalLosses: acc.loss,
        goalsFavor: match.homeTeamGoals,
        goalsOwn: match.awayTeamGoals,
      };
    });
  }

  static createAwayMatches(matches: any[]) {
    return matches.map((match) => {
      let acc = { points: 0, win: 0, draw: 0, loss: 0 };
      if (match.homeTeamGoals === match.awayTeamGoals) {
        acc = { ...acc, points: 1, draw: 1 };
      } else if (match.awayTeamGoals > match.homeTeamGoals) {
        acc = { ...acc, points: 3, win: 1 };
      } else { acc = { ...acc, loss: 1 }; }
      return {
        name: match.teamAway.teamName,
        totalPoints: acc.points,
        totalVictories: acc.win,
        totalDraws: acc.draw,
        totalLosses: acc.loss,
        goalsFavor: match.awayTeamGoals,
        goalsOwn: match.homeTeamGoals,
      };
    });
  }

  static accMatches(matches: any[]) {
    const preLeaderBoard = [] as ILeaderboard[];
    matches.forEach((match) => {
      const index = preLeaderBoard.findIndex((accMatch) => accMatch.name === match.name);
      if (index === -1) preLeaderBoard.push({ ...match, totalGames: 1 });
      else {
        preLeaderBoard[index].totalPoints += match.totalPoints;
        preLeaderBoard[index].totalGames += 1;
        preLeaderBoard[index].totalVictories += match.totalVictories;
        preLeaderBoard[index].totalDraws += match.totalDraws;
        preLeaderBoard[index].totalLosses += match.totalLosses;
        preLeaderBoard[index].goalsFavor += match.goalsFavor;
        preLeaderBoard[index].goalsOwn += match.goalsOwn;
      }
    });
    return preLeaderBoard;
  }

  static completeLeaderboard(matches: ILeaderboard[]) {
    return matches.map((match) => ({
      ...match,
      goalsBalance: match.goalsFavor - match.goalsOwn,
      efficiency: ((match.totalPoints / (match.totalGames * 3)) * 100).toFixed(2),
    })).sort((a, b) => (
      b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || a.goalsOwn - b.goalsOwn
    ));
  }
}
