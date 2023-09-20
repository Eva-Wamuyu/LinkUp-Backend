import { DB } from '../DBHelpers/index.js';
import { validateUpdateSchema } from '../Validators/userValidators.js';

export const getUserByUsername = async(req,res)=>{
    try {
        const username = req.params.username
        const user_id = req.info.issuer || null;

        const response = await DB.exec('usp_GetUserInfo',{username, user_id});
        
        if(response.rowsAffected == 1){
            const user = response.recordset
            return res.status(200).json({
                status: 'ok',
                user,
            }); 
        }
        return res.status(404).json({
       
            message: 'User with that username not found'  
        }); 
   
    } catch (error) {
        
        return res.status(500).json({
      
            message: 'Internal Server Error'  
        }); 
        
    }
}

export const updateUserDetails = async(req,res)=>{
    try {
        const user_id = req.info.issuer;

        const {error} = validateUpdateSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
			
				message: error.message,
			});
        }
        const {bio, profile_image} = req.body;
        const response = await DB.exec('usp_UpdateUserProfile',{user_id, bio, profile_image})
        // console.log(response)
        return res.status(200).json({
            status: 'ok',
            message: 'Updated profile successfully'  
        }); 

        
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
               
        });
    }
}


export const getUsersToFollow = async(req,res)=>{
    try {
        const user_id = req.info.issuer;
        const response = await DB.exec('usp_GetUnfollowedUsers',{user_id})
        const users = response.recordset
        console.log(users)
        if(users.length >= 0) {
            return res.status(200).json({
                status: 'ok',
                users
            }); 
        }
        else{
            return res.status(404).json({
              
                message: 'Users Not Found'  
            }); 
        }
       }catch (error){
        console.log(error.message)
        return res.status(500).json({
          
            message: 'Internal Server Error'  
        }); 
    }
}


export const getUserProfile = async(req,res)=>{
    try {
        const username = req.info.subject 
        const response = await DB.exec('usp_GetUserInfo',{username,user_id:''});
        const user = response.recordset
        if(user.length > 0){
            return res.status(200).json({
                status: 'ok',
                user: user[0],
            }); 
        }
        
        return res.status(403).json({
            message: 'User not found'  
        }); 
   
    } catch (error) {
        
        return res.status(500).json({
            message: 'Internal Server Error'  
        }); 
        
    }
}
