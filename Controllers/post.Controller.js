import { DB } from '../DBHelpers/index.js';
import { v4 as uuidv4 } from 'uuid';
import { validatePostSchema } from '../Validators/postValidators.js';

const validateInput = (req, res) => {
    const { error } = validatePostSchema.validate(req.body);
    if (error) {
        return res.status(422).json({
            message: error.message,
        });
    }
    return true;
};


export const createPost = async (req, res) =>{
    if (!validateInput(req, res)) return;
    try {
        const username = req.info.subject;

        const { content, image_url } = req.body;
        const post_id = uuidv4();
        const response = await DB.exec('usp_CreatePost', {
            post_id,
            username,
            content,
            image_url,
        });
        if(response.rowsAffected == 1){
            return res.status(201).json({
                status: 'ok',
                message: 'Post Added Successfully',
                
            });
        }
        return res.status(500).json({
          
            message: 'Error Adding Post',
        });
    } catch (error) {
        return res.status(500).json({
            
            message: 'Internal Server Error', 
        }); 
    }
}


export const editPost = async(req,res)=>{

    if (!validateInput(req, res)) return;
    try {
        const username = req.info.subject;
        const post_id = req.params.post_id;
        const {content, image_url} = req.body;
        const response = await DB.exec('usp_EditPost',{username,post_id,content,image_url})
        if(response.rowsAffected == 1){
            return res.status(200).json({
                status: 'ok',
                message: 'Post Updated successfully',     
            }); 
        }
        else{
            return res.status(404).json({
                
                message: 'Post With that ID Belonging to that user not Found',
            }); 
        }
    } catch (error) {
        return res.status(500).json({
          
            message: 'Internal Server Error',
        });  
    }
}

export const deletePost = async (req, res) => {
    try {
        const username = req.info.subject;
        if(!username){
            return res.status(401).json({
				
				message: 'Unauthorized to perform the request',
			});

        }
        const post_id = req.params.post_id;
        const response = await DB.exec('usp_DeletePost',{post_id, username});
      
        const message = response.recordset[0]['Message'];
        if(message === 'Post deleted'){
            return res.status(200).json({
                status: 'ok',
                message:'Post Deleted Successfully'
            })
        }
        else if (message === 'Post not found'){
            return res.status(404).json({
               
                message: 'Post With that ID Belonging to that user not Found',  
            });  
        }   
    } catch (error) {
        
        return res.status(500).json({
           
            message: 'Internal Server Error',   
        }); 
    }
}


export const getUserPosts = async(req,res)=>{
    try {
        const username = req.params.username;
        const username2= req.info.subject || null;
        const result = await DB.exec('usp_GetUserByUsername',{username})

        if(result.rowsAffected[0] == 0){
            return res.status(404).json({
                message: 'User Not Found'  
            }); 
        }

        const response = await DB.exec('usp_getAllUserPosts',{username, username2});
        const posts = response.recordset
        
        if(posts.length >= 0){
            return res.status(200).json({
                status: 'ok',
                posts,
                   
            }); 
        }
        
                
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          
            message: 'Internal Server Error',
            
        });
    }
}

export const getAllPosts = async(req, res)=>{
    try {
        const username = req.info.subject || null;
        const response = await DB.exec('usp_getAllPosts',{username});
        const posts = response.recordset || [];
            return res.status(200).json({
                status: 'ok',
                posts,
                   
            }); 
    } catch (error) {
        
        return res.status(500).json({
            message: 'Internal Server Error',
            
        });
    }
}


export const getPostCommentDetails = async(req,res)=>{
    try {
        const username = req.info.subject || null;
        const post_id = req.params.post_id;

        const result =  await DB.exec('usp_GetPostById',{post_id,username})

        if(result.rowsAffected[0] == 0){
            return res.status(404).json({
             
                message: 'Post With That Id Not Found'
                   
            }); 
        }
        else{
            const post = result.recordset[0]
            const response = await DB.exec('usp_GetPostDetails',{post_id,username});
            const allComments = response.recordset

            const comments = [];

            const CommentObj = {};

            allComments.forEach(comment => {

            const commentId = comment.comment_id;

            if(comment.level_1_comment_id == null){
                comments.push({
                    comment
                });
            }
            else{
                const parentComment = CommentObj[comment.level_1_comment_id]

                if (parentComment) {
                
                if (!parentComment.subcomments) {
                      parentComment.subcomments = [];
                      parentComment.subcomments.push(comment); 
                  }
                  else{
                    parentComment.subcomments.push(comment);
                  }
                }
                }           
                CommentObj[commentId] = comment;
                });

                return res.status(200).json({
                    status: 'ok',
                    post,
                    comments
                 }); 
                }

    } catch (error) {
        
        return res.status(500).json({
          
            message: 'Internal Server Error',
            
        });
        
    }
}


export const getPostsForFollowing = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}