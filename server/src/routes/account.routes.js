import { Router } from 'express';

import AccountController from '../controllers/account.controller';
import Auth from '../middleware/Auth';

const accountRouter = Router();

accountRouter.post('/', Auth.getUser, AccountController.createBankAccount);

export default accountRouter;
