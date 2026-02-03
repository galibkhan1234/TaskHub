import express from 'express';
import {getCurrentUser, registerUser, updatePassword, updateUserProfile, userLogin, } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js'

const userRouter = express.Router();

//PUBLIC LINKS

userRouter.post('/register',registerUser);
userRouter.post('/login',userLogin);

//PRIVATE LINKS
//all route protected

userRouter.get('/me',authMiddleware, getCurrentUser);
userRouter.put('/profile',authMiddleware, updateUserProfile);
userRouter.put('/update',authMiddleware, updatePassword);

export default userRouter;