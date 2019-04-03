import { Router } from 'express';

import TransactionController from '../controllers/transaction.controller';
import Auth from '../middleware/Auth';

const { getUser, staffCheck } = Auth;
const { makeTransaction } = TransactionController;

const transactionRouter = Router();

transactionRouter.post('/:acctNumber/credit', getUser, staffCheck, makeTransaction);
transactionRouter.post('/:acctNumber/debit', getUser, staffCheck, makeTransaction);

export default transactionRouter;
