import { Router } from 'express';

import AccountController from '../controllers/account.controller';
import Auth from '../middleware/Auth';
import AccountValidation from '../middleware/AccountValidator';

const { getUser, staffCheck } = Auth;
const { accountNumberCheck, accountStatusCheck, accountDetailsCheck } = AccountValidation;
const { createBankAccount, updateAccountStatus, deleteBankAccount } = AccountController;

const accountRouter = Router();

accountRouter.post('/', getUser, accountDetailsCheck, createBankAccount);
accountRouter.patch(
  '/:acctNumber',
  getUser,
  staffCheck,
  accountNumberCheck,
  accountStatusCheck,
  updateAccountStatus
);
accountRouter.delete('/:acctNumber', getUser, staffCheck, accountNumberCheck, deleteBankAccount);

export default accountRouter;
