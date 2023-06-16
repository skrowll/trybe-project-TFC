import { Router } from 'express';
import MatchController from '../controllers/match.controller';
import validateRole from '../middlewares/auth.middleware';
import checkTokenExist from '../middlewares/token.middleware';

const matchRouter = Router();
const matchController = new MatchController();

matchRouter.get('/', matchController.listAllInProgress, matchController.list);
matchRouter.post('/', checkTokenExist, validateRole, matchController.createNewMatch);
matchRouter.patch('/:id/finish', checkTokenExist, validateRole, matchController.finishMatch);
matchRouter.patch('/:id', checkTokenExist, validateRole, matchController.updateGoals);

export default matchRouter;
