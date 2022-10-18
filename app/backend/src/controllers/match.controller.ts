import { Request, Response, NextFunction } from 'express';
import MatchService from '../services/match.service';

export default class UserController {
  matchService = new MatchService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.matchService.list();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public listAllInProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { inProgress } = req.query;
      if (!inProgress) return next();
      const result = await this.matchService.listAllInProgress(inProgress === 'true');
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public createNewMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const match = req.body;
      const result = await this.matchService.createNewMatch(match);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}
