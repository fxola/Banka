import { Router } from 'express';

import AccountController from '../controllers/AccountController';
import Auth from '../middleware/Auth';
import AccountValidation from '../middleware/AccountValidator';

const { getUser, staffCheck } = Auth;
const { accountNumberCheck, accountStatusCheck, accountDetailsCheck } = AccountValidation;
const {
  createBankAccount,
  updateAccountStatus,
  deleteBankAccount,
  fetchAllTransactions,
  fetchAllAccounts
} = AccountController;

const accountRouter = Router();
accountRouter.get('/', getUser, staffCheck, fetchAllAccounts);
accountRouter.post('/', getUser, accountDetailsCheck, createBankAccount);
accountRouter.patch(
  '/:acctNumber',
  getUser,
  staffCheck,
  accountNumberCheck,
  accountStatusCheck,
  updateAccountStatus
);
accountRouter.get('/:acctNumber/transactions', getUser, accountNumberCheck, fetchAllTransactions);
accountRouter.delete('/:acctNumber', getUser, staffCheck, accountNumberCheck, deleteBankAccount);

export default accountRouter;
