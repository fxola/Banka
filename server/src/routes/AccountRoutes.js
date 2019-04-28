import { Router } from 'express';

import AccountController from '../controllers/AccountController';
import Auth from '../middleware/Auth';
import AccountValidation from '../middleware/AccountValidator';
import upload from '../middleware/imageUpload';

const { getUser, staffCheck } = Auth;

const {
  accountNumberCheck,
  accountStatusCheck,
  accountDetailsCheck,
  accountPermission
} = AccountValidation;

const {
  createBankAccount,
  updateAccountStatus,
  deleteBankAccount,
  fetchAllTransactions,
  fetchAccounts,
  fetchOneAccount
} = AccountController;

const accountRouter = Router();

accountRouter.get('/', getUser, staffCheck, fetchAccounts);
accountRouter.get('/:acctNumber', getUser, accountNumberCheck, accountPermission, fetchOneAccount);
accountRouter.get(
  '/:acctNumber/transactions',
  getUser,
  accountNumberCheck,
  accountPermission,
  fetchAllTransactions
);
accountRouter.post('/', getUser, upload.single('avatar'), accountDetailsCheck, createBankAccount);
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
