import { Router } from 'express';

import UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/signup', UserController.createUser);

export default userRouter;
