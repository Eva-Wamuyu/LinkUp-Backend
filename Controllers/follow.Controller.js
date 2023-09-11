import { DB } from '../DBHelpers/index.js';


export const followUser = async(req,res)=>{
    try {

        const follower_id = req.info.issuer;
        const following_id = req.params.user_id;
        
        // console.log(follower_id, following_id)
        const response = (await DB.exec('usp_FollowOrUnfollowUser',{follower_id, following_id}));
         
        const message = response.recordset[0].Message;

        if(message == 'User with that Id not Found'){
            return res.status(404).json({
                status: 'error',
                message: 'User with that Id not Found',   
            });
        }
        else{
            return res.status(200).json({
                status: 'success',
                message
            });
        }        

    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
               
        });
    }
}

export const getFollowers = async(req,res)=>{
    try {
        const user_id = req.info.issuer;
        const response = await DB.exec('usp_GetFollowers',{user_id});
        if(response.recordset.length >= 0){
            const followers = response.recordset
            return res.status(200).json({
                status: 'success',
                followers  
            });
        }
        else{
            return res.status(404).json({
                status: 'error',
                message: 'Followers not found',   
            });
        } 
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}

export const getFollowing = async(req,res)=>{
    try {
        const user_id = req.info.issuer;

        const response = await DB.exec('usp_GetFollowing',{user_id});
       
        if(response.recordset.length >= 0){
            const following = response.recordset
            return res.status(200).json({
                status: 'success',
                following     
            });
        }
        else{
            return res.status(404).json({
                status: 'error',
                message: 'Followers not found',   
            });
        } 
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}