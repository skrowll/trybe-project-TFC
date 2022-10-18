import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const leaderboardRouter = Router();
const leaderboardController = new LeaderboardController();

leaderboardRouter.get('/home', leaderboardController.getHomeMatches);
leaderboardRouter.get('/away', leaderboardController.getAwayMatches);

export default leaderboardRouter;
