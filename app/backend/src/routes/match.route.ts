import { Router } from 'express';
import MatchController from '../controllers/match.controller';

const matchRouter = Router();
const matchController = new MatchController();

matchRouter.get('/', matchController.listAllInProgress);
matchRouter.get('/', matchController.list);

export default matchRouter;
