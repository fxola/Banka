import { Router } from 'express';

import UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/signup', UserController.createUser);
userRouter.post('/signin', UserController.logUserIn);

export default userRouter;
