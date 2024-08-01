import { Router } from "express";
import {authenticateToken,checkUser} from "../Middleware/index.js";
import { createComment,editComment,deleteComment,createSubComment, getUserComments } from "../Controllers/comment.Controller.js";


const commentRouter = Router();


commentRouter.post('/:post_id/comment',authenticateToken, createComment);//ADD COMMENT
commentRouter.patch('/comment/:comment_id/',authenticateToken, editComment);//EDIT COMMENT
commentRouter.delete('/comment/:comment_id/',authenticateToken, deleteComment);//DELETE COMMENT
commentRouter.post('/comment/:comment_id',authenticateToken, createSubComment);//ADD SUBCOMMENT
commentRouter.get('/comment/user/:username',checkUser,getUserComments);//GET COMMENTS FOR A USER

export default commentRouter;