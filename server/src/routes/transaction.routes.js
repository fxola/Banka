import { Router } from 'express';

import TransactionController from '../controllers/transaction.controller';
import Auth from '../middleware/Auth';
import AccountValidation from '../middleware/accountValidation';
import TransactionValidation from '../middleware/transactionValidation';

const { getUser, staffCheck } = Auth;
const { accountNumberCheck } = AccountValidation;
const { transactionCheck } = TransactionValidation;
const { makeTransaction } = TransactionController;

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

export default transactionRouter;
