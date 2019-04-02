import { Router } from 'express';

import AccountController from '../controllers/account.controller';
import Auth from '../middleware/Auth';

const { getUser, staffCheck } = Auth;
const { createBankAccount, updateAccountStatus, deleteBankAccount } = AccountController;

const accountRouter = Router();

accountRouter.post('/', getUser, createBankAccount);
accountRouter.patch('/:acctNumber', getUser, staffCheck, updateAccountStatus);
accountRouter.delete('/:acctNumber', getUser, staffCheck, deleteBankAccount);

export default accountRouter;
