import { Router } from "express";
import { registerUser,loginUser,confirmToken,resetPassword,updatePassword } from "../Controllers/auth.Controller.js";
import { getUserByUsername,updateUserDetails,getUsersToFollow,getUserProfile } from "../Controllers/user.Controller.js";
import {checkUser,authenticateToken} from "../Middleware/index.js"

const userRouter = Router();
userRouter.post('/auth/check', authenticateToken,confirmToken);
userRouter.post('/auth/register', registerUser);
userRouter.post('/auth/login', loginUser);
userRouter.get('/:username',checkUser, getUserByUsername);
userRouter.patch('/',authenticateToken, updateUserDetails);
userRouter.get('/all/connect',authenticateToken,getUsersToFollow)
userRouter.get('/info/profile',authenticateToken,getUserProfile)
userRouter.post('/auth/reset',resetPassword)
userRouter.post('/auth/reset/:token',updatePassword)

export default userRouter;