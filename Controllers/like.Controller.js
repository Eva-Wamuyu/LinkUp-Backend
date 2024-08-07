import { DB } from '../DBHelpers/index.js';


export const likePost = async(req,res)=>{
    try {
        const username = req.info.subject;
        const post_id = req.params.post_id;
        
        const response = (await DB.exec('usp_LikeorUnlikePost',{username, post_id}));
         
        const message = response.recordset[0].Message;

        if(message == 'Post With that ID Not Found'){
            return res.status(404).json({
                message: 'Post With that ID Not Found',   
            });
       
        }
        else{
            return res.status(200).json({
                status: 'ok',
                message
            });
        }        

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
               
        });
    }
}


export const likeComment = async(req,res)=>{
    try {
        const username = req.info.subject;
        const comment_id = parseInt(req.params.comment_id, 10);
        
        const response = (await DB.exec('usp_LikeUnlikeComment',{username, comment_id}));
         
        const message = response.recordset[0].Message;
        if(message == 'Comment with that ID not found'){
            return res.status(404).json({
                message,   
            });
       
        }
        else{
            return res.status(200).json({
                status: 'ok',
                message
            });
        }        

    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
               
        });
    }
}


