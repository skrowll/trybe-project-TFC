import { Router } from 'express';
import MatchController from '../controllers/match.controller';
import validateToken from '../middlewares/auth.middleware';

const matchRouter = Router();
const matchController = new MatchController();

matchRouter.get('/', matchController.listAllInProgress);
matchRouter.get('/', matchController.list);
matchRouter.post('/', validateToken, matchController.createNewMatch);

export default matchRouter;
