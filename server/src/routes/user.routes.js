import { Router } from 'express';

import UserController from '../controllers/user.controller';

import UserValidation from '../middleware/userValidation';

const { signUpCheck, loginCheck } = UserValidation;
const { createUser, logUserIn } = UserController;

const userRouter = Router();

userRouter.post('/signup', signUpCheck, createUser);
userRouter.post('/signin', loginCheck, logUserIn);

export default userRouter;
