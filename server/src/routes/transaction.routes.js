import { Router } from 'express';

import TransactionController from '../controllers/transaction.controller';
import Auth from '../middleware/Auth';
import AccountValidation from '../middleware/AccountValidator';
import TransactionValidation from '../middleware/TransactionValidator';

const { getUser, staffCheck } = Auth;
const { accountNumberCheck } = AccountValidation;
const { transactionCheck } = TransactionValidation;
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

transactionRouter.get('/:id', getUser, fetchSingleTransaction);

export default transactionRouter;
