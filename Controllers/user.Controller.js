import { DB } from '../DBHelpers/index.js';
import { validateUpdateSchema } from '../Validators/userValidators.js';

export const getUserByUsername = async(req,res)=>{
    try {
        const username = req.params.username
        const user_id = req.info.issuer || null;

        const response = await DB.exec('usp_GetUserInfo',{username, user_id});
        const user = response.recordset
        if(user.length > 0){
            return res.status(200).json({
                status: 'success',
                user,
            }); 
        }
        return res.status(404).json({
            status: 'error',
            message: 'User with that username not found'  
        }); 
   
    } catch (error) {
        
        return res.status(500).json({
            status: 'error',
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
				status: 'error',
				message: error.message,
			});
        }
        const {bio, profile_image} = req.body;
        const response = await DB.exec('usp_UpdateUserProfile',{user_id, bio, profile_image})
        console.log(response)
        return res.status(200).json({
            status: 'success',
            message: 'Updated profile successfully'  
        }); 

        
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'  
        }); 
    }
}


export const getUsersToFollow = async(req,res)=>{
    try {
        const user_id = req.info.issuer;
        const response = await DB.exec('usp_GetUnfollowedUsers',{user_id})
        const users = response.recordset
        if(users.length > 0) {
            return res.status(200).json({
                status: 'success',
                users
            }); 
        }
        else{
            return res.status(404).json({
                status: 'error',
                message: 'Users Not Found'  
            }); 
        }
       }catch (error){
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'  
        }); 
    }
}