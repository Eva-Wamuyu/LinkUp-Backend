import { validateCommentSchema } from "../Validators/commentValidators.js";
import { DB } from '../DBHelpers/index.js';



const validateInput = (req, res) => {
    const { error } = validateCommentSchema.validate(req.body);
    if (error) {
        return res.status(422).json({
            message: error.message,
        });
    }
    return true;
};

export const createComment = async (req, res) =>{
    if (!validateInput(req, res)) return;

    try {
        
        const username = req.info.subject;
        const post_id = req.params.post_id;

        const  content = req.body.content;
     
        const response = await DB.exec('usp_CreateComment', {
            post_id,
            username,
            content,
        });

        const message = response.recordset[0]['Message'];
        if(message == 'Comment added successfully.'){
            return res.status(201).json({
                status: 'ok',
                message
                
            });
        }
        else if(message == 'Post with that ID not exist.')
        return res.status(404).json({
            
            message:message
        });

       

    } catch (error) {
        return res.status(500).json({
            
            message: 'Internal Server Error',
               
        }); 
    }
}

export const editComment = async(req,res)=>{

    if (!validateInput(req, res)) return;
    try {
        const username = req.info.subject;
        const comment_id = req.params.comment_id;
        const {content} = req.body;
        const response = await DB.exec('usp_EditComment',{username,comment_id,content})
        if(response.rowsAffected == 1){
            return res.status(200).json({
                status: 'ok',
                message: 'Comment Updated Successfully',     
            }); 
        }
        else{
            return res.status(404).json({
                
                message: 'Comment With that ID Belonging to that user not Found',
            }); 
        }
    } catch (error) {
        return res.status(500).json({
           
            message: 'Internal Server Error',
        });  
    }
       
}

export const deleteComment = async(req,res)=>{
    try {
        const username = req.info.subject;
        const comment_id = req.params.comment_id;
        const response = await DB.exec('usp_DeleteComment',{comment_id, username});
      
        const message = response.recordset[0]['Message'];
        if(message === 'Comment deleted'){
            return res.status(200).json({
                status: 'ok',
                message:'Comment Deleted Successfully'
            })
        }
        else if (message === 'Comment not found'){
            return res.status(404).json({
               
                message: 'Comment With that ID Belonging to that user not Found',   
            });    
        }
    } catch (error) {
        return res.status(500).json({
            
            message: 'Internal Server Error',   
        }); 
    }
}

export const createSubComment = async(req,res)=>{

    if (!validateInput(req, res)) return;
    try {
        const username = req.info.subject;
        const comment_id = req.params.comment_id;
        const  content = req.body.content;
        const response = await DB.exec('usp_CreateSubComment', {
            comment_id,
            username,
            content,
        });
        const message = response.recordset[0]['Message'];
        if(message == 'Subcomment added successfully.'){
            return res.status(201).json({
                status: 'ok',
                message
            });
        }
        else if(message == 'Comment with that ID does not exist.')
        return res.status(404).json({
            
            message:message
        });
    } catch (error) {
        return res.status(500).json({
           
            message: 'Internal Server Error', 
        }); 
    }
}

export const getUserComments = async(req,res)=>{
    try {
        const username = req.params.username;

        const result = await DB.exec('usp_GetUserByUsername',{username})

        if(result.rowsAffected == 0){
            return res.status(404).json({
                message: 'User not found', 
            });
        }
        else{
            const response = await DB.exec('usp_GetUserComments',{username})
            return res.status(200).json({
                status: "ok",
                comments:response.recordset 
            });
        }  
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error', 
        });
    }
}


