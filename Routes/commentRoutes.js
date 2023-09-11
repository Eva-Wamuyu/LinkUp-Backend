import { Router } from "express";
import {authenticateToken,checkUser} from "../Middleware/index.js";
import { createComment,editComment,deleteComment,createSubComment } from "../Controllers/comment.Controller.js";


const commentRouter = Router();


commentRouter.post('/:post_id/comment',authenticateToken, createComment);//ADD COMMENT
commentRouter.patch('/comment/:comment_id/',authenticateToken, editComment);//EDIT COMMENT
commentRouter.delete('/comment/:comment_id/',authenticateToken, deleteComment);//EDIT COMMENT
commentRouter.post('/comment/:comment_id',authenticateToken, createSubComment);//ADD SUBCOMMENT
export default commentRouter;