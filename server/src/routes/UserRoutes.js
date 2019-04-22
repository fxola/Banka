import { Router } from 'express';

import UserController from '../controllers/UserController';

import UserValidation from '../middleware/UserValidator';

import Auth from '../middleware/Auth';

const { signUpCheck, loginCheck } = UserValidation;
const { createUser, logUserIn, makeStaff, fetchUserAccounts } = UserController;
const { getUser, adminCheck } = Auth;

const userRouter = Router();

userRouter.post('/auth/signup', signUpCheck, createUser);
userRouter.post('/auth/signin', loginCheck, logUserIn);
userRouter.put('/auth/makestaff', getUser, adminCheck, makeStaff);
userRouter.get('/user/:email/accounts', getUser, fetchUserAccounts);

export default userRouter;
