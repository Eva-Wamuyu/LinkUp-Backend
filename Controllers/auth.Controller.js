import { DB } from '../DBHelpers/index.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../Middleware/index.js';
import { validateRegisterSchema, validateloginSchema } from '../Validators/userValidators.js';


export const registerUser = async (req, res) => {
	try {
		const { error } = validateRegisterSchema.validate(req.body);
		if (error) {
			return res.status(422).json({
				status: 'error',
				message: error.message,
			});
		}
        const { username, email, password } = req.body;
        const response = (await DB.exec('usp_CheckUserExists',{username, email}));
        const message = response.recordset[0]['Message'];

        if (message === 'Username already exists.') {
            return res.status(409).json({
                status: 'error',
                message: "Woops,this username is already taken"
            });
        } else if (message === 'Email already exists.') {
            return res.status(409).json({
                status: 'error',
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
                status: 'success',
                message: 'Account Created Successfully',
                token,
                user: {
                    username,
                },
            });
        }

	} catch (error) {
    return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',    
        }); 
	}
};


export const loginUser = async (req, res) => {
	try {
		const { error } = validateloginSchema.validate(req.body);
		if (error) {
			return res.status(422).json({
				status: 'error',
				message: error.message,
			});
		}
        const { emailOrUsername, password } = req.body;
        const response = (await DB.exec('usp_GetUserByMailOrUsername',{emailOrUsername}));
        const user = response.recordset;

        if (user.length == 0) {
			return res.status(404).json({
				status: 'error',
				message: 'Woops, seems You Do Not have An Account',
			});
        }else{
                const { password: hashedPwd, ...payload } = user[0];
                const comparePwd = await bcrypt.compare(password, hashedPwd);
                if (comparePwd) {
                    const token = generateAccessToken(payload);
    
                    return res.status(200).json({
                            status: 'success',
                            user: {
                                username: user[0]['username'],
                                user_id: user[0]['user_id'],
                               
                            },
                            message: 'Login successful',
                            token,
                        });
                  
                } else {
                    return res.status(403).json({
                        status: 'error',
                        message: 'Woops, Password is not correct',
                    });
                }
            }
	} catch (error) {
    console.log(error);
    return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
               
        });
        
	}
};