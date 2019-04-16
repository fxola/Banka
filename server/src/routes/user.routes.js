import { Router } from 'express';

import UserController from '../controllers/user.controller';

import UserValidation from '../middleware/UserValidator';

import Auth from '../middleware/Auth';

const { signUpCheck, loginCheck } = UserValidation;
const { createUser, logUserIn, makeStaff } = UserController;
const { getUser, adminCheck } = Auth;

const userRouter = Router();

userRouter.post('/signup', signUpCheck, createUser);
userRouter.post('/signin', loginCheck, logUserIn);
userRouter.put('/makestaff', getUser, adminCheck, makeStaff);

export default userRouter;
