import { Router } from "express";
import {authenticateToken} from "../Middleware/index.js";
import { likePost,likeComment } from "../Controllers/like.Controller.js";

const likeRouter = Router();


likeRouter.post('/post/:post_id',authenticateToken, likePost);//LIKE POST
likeRouter.post('/comment/:comment_id',authenticateToken, likeComment);//LIKE COMMENT



export default likeRouter;