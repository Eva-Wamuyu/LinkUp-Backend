import { Router } from "express";
import { registerUser,loginUser } from "../Controllers/auth.Controller.js";


const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;