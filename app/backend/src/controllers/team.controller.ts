import { Request, Response, NextFunction } from 'express';
import TeamService from '../services/team.service';

export default class UserController {
  teamService = new TeamService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.teamService.list();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.teamService.findById(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
