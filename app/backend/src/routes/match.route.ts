import { Router } from 'express';
import MatchController from '../controllers/match.controller';
import authMiddleware from '../middlewares/auth.middleware';

const matchRouter = Router();
const matchController = new MatchController();

matchRouter.get('/', matchController.listAllInProgress);
matchRouter.get('/', matchController.list);
matchRouter.post('/', authMiddleware, matchController.createNewMatch);
matchRouter.patch('/:id/finish', matchController.finishMatch);
matchRouter.patch('/:id', matchController.updateGoals);

export default matchRouter;
