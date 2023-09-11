import { Router } from "express";
import {authenticateToken} from "../Middleware/index.js";
import { followUser,getFollowers,getFollowing } from "../Controllers/follow.Controller.js";

const followRouter = Router();


followRouter.post('/:user_id',authenticateToken, followUser);//FOLLOW//UNFOLLOW USER
followRouter.get('/followers/users',authenticateToken, getFollowers);//Get followers
followRouter.get('/following/users',authenticateToken, getFollowing);//Get following


export default followRouter;