import { Router } from "express";
import { createPost,deletePost,editPost,getAllPosts,getUserPosts,getPostCommentDetails } from "../Controllers/post.Controller.js";
import {authenticateToken,checkUser} from "../Middleware/index.js"

const postRouter = Router();

postRouter.post('',authenticateToken, createPost);//ADD POST
postRouter.patch('/:post_id',authenticateToken, editPost);//EDIT POST
postRouter.delete('/:post_id',authenticateToken,deletePost);//DELETE POST
postRouter.get('/:post_id',checkUser,getPostCommentDetails);//GET ONE POST DETAILS
postRouter.get('/user/:username',checkUser,getUserPosts); //GET POSTS FOR ONE USER
postRouter.get('',checkUser,getAllPosts) //GET ALL POSTS





export default postRouter;