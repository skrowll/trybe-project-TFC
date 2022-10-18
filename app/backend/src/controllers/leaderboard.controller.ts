import { Request, Response, NextFunction } from 'express';
import LeaderboardService from '../services/leaderboard.service';

export default class LeaderboardController {
  leaderboardService = new LeaderboardService();

  public getHomeMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.leaderboardService.getHomeMatches();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAwayMatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.leaderboardService.getAwayMatches();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
