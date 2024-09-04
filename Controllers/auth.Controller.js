import { DB } from '../DBHelpers/index.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../Middleware/index.js';
import { validateRegisterSchema, validateloginSchema,validateResetEmail } from '../Validators/userValidators.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'; dotenv.config();
import { sendResetLink } from '../MailService/sendResetLink.js';

export const registerUser = async (req, res) => {
	try {
		const { error } = validateRegisterSchema.validate(req.body);
		if (error) {
			return res.status(422).json({
				
				message: error.message,
			});
		}
        const { username, email, password } = req.body;
        const response = (await DB.exec('usp_CheckUserExists',{username, email}));
        const message = response.recordset[0]['Message'];

        if (message === 'Username already exists.') {
            return res.status(409).json({
                
                message: "Woops,this username is already taken"
            });
        } else if (message === 'Email already exists.') {
            return res.status(409).json({
                
                message
            });
        } else {
            const user_id = uuidv4();
            const hashed_password = await bcrypt.hash(password, 5);
            const response = await DB.exec('usp_AddUser', {
                user_id,
                username,
                email,
                password: hashed_password,
            });
            const new_user = response.recordset[0];
            const payload = {
				user_id: new_user.user_id,
				username: new_user.username,
			};
            const token = generateAccessToken(payload);
            return res.status(201).json({
                status: 'ok',
                message: 'Account Created Successfully',
                token,
                user: {
                    username,
                },
            });
        }

	} catch (error) {
   
    return res.status(500).json({
            
            message: 'Internal Server Error',    
        }); 
	}
};


export const loginUser = async (req, res) => {
	try {
		const { error } = validateloginSchema.validate(req.body);
		if (error) {
			return res.status(422).json({
				
				message: error.message,
			});
		}
        const { emailOrUsername, password } = req.body;
        const response = (await DB.exec('usp_GetUserByMailOrUsername',{emailOrUsername}));
        const user = response.recordset;

        if (user.length == 0) {
			return res.status(404).json({
				
				message: 'Woops, seems You Do Not have An Account',
			});
        }else{
                const { password: hashedPwd, ...payload } = user[0];
                const comparePwd = await bcrypt.compare(password, hashedPwd);
                if (comparePwd) {
                    const token = generateAccessToken(payload);
    
                    return res.status(200).json({
                            status: 'ok',
                            user: {
                                username: user[0]['username'],
                                user_id: user[0]['user_id'],
                               
                            },
                            message: 'Login successful',
                            token,
                        });
                  
                } else {
                    return res.status(403).json({
                       
                        message: 'Woops, Password is not correct',
                    });
                }
            }
	} catch (error) {
    console.log(error);
    return res.status(500).json({
            
            message: 'Internal Server Error',
               
        });
        
	}
};

export const confirmToken = async(req,res)=>{

    const username = req.info.subject;
    const user_id = req.info.issuer;

    return res.status(200).json({
        status: 'ok',
        user: {
            username: username,
            user_id: user_id,
        },
    });

}

export const resetPassword = async(req,res)=>{
    try {
        
       const {error} = validateResetEmail.validate(req.body)
       if(error){
        return res.status(422).json({
            message: error.message
       })
       }
       const email = req.body.email
       const result = await DB.exec('usp_GetUserByMail',{email})
       
       if(result.rowsAffected[0] == 0){
        return res.status(404).json({
            message: 'User Not Found'
       })
       }
       else{
            const user = result.recordset[0];
			const user_mail = user.email;
			const username = user.username;
            
            const token = Math.random().toString(36).slice(2, 8);
			const response = await DB.exec('usp_AddToken', { username, token });
            
            if(response.rowsAffected[0] == 1){
            const encrypted = jwt.sign({token,username},process.env.JWT_SECRET,{
                expiresIn: '3h'
            })
			const link = `${process.env.FE_URL}${encrypted}`;
			await sendResetLink(user_mail, username, link);

			return res.status(200).json({
				status: 'ok',
				message: 'Reset Link Sent To Your Email',
			});
        }
       }
    } catch (error) {

        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const encrypted = req.params.token;
        let details;

        try {
            details = jwt.verify(encrypted, process.env.JWT_SECRET);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(403).json({ message: "Token expired" });
            }
            return res.status(403).json({ message: "Token verification failed" });
        }

        const result = await DB.exec('usp_CheckToken', { username: details.username, token: details.token });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Reset Link Expired or used. Request for a new one',
            });
        }

        const password = req.body.password;
        if (!password) {
            return res.status(400).json({
                message: 'Password is required',
            });
        }
        const hashed_password = await bcrypt.hash(password, 5);
        const res_ = await DB.exec('usp_UpdatePassword', { password: hashed_password, username: details.username });

        if(res_.rowsAffected[0] === 1) {
            return res.status(200).json({
                status: "ok",
                message: 'Password updated successfully',
            });
        }else{
            return res.status(500).json({
                message: 'Unable to update password',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}