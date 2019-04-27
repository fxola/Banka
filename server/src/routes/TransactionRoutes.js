import { Router } from 'express';

import TransactionController from '../controllers/TransactionController';
import Auth from '../middleware/Auth';
import AccountValidation from '../middleware/AccountValidator';
import TransactionValidation from '../middleware/TransactionValidator';

const { getUser, staffCheck } = Auth;
const { accountNumberCheck } = AccountValidation;
const { transactionCheck, transactionPermission } = TransactionValidation;
const { makeTransaction, fetchSingleTransaction } = TransactionController;

const transactionRouter = Router();

transactionRouter.post(
  '/:acctNumber/credit',
  getUser,
  staffCheck,
  accountNumberCheck,
  transactionCheck,
  makeTransaction
);

transactionRouter.post(
  '/:acctNumber/debit',
  getUser,
  staffCheck,
  accountNumberCheck,
  transactionCheck,
  makeTransaction
);

transactionRouter.get('/:id', getUser, transactionPermission, fetchSingleTransaction);

export default transactionRouter;
