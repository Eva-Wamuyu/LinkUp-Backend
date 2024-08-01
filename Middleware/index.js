import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (user) => {
    const payload = {
        issuer: user.user_id,
        subject: user.username 
    }
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: '48h'
    })
}

export const authenticateToken = (req,res,next)=>{
    const authHeaders = req.headers['authorization'];

    const token = authHeaders && authHeaders.split(' ')[1];
    req.info = {};
    if(token == null){
       return res.status(401).json({message:'No Token Provided'});
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err instanceof jwt.TokenExpiredError){
            return res.status(403).json({message: "Token expired"});
        }
        if(err){
            return res.status(403).json({message: "Token verification failed"});
        }
        req.info = decoded;
       
        next();
    })

}


export const checkUser = (req,res,next)=>{
    const authHeaders = req.headers['authorization'];

    const token = authHeaders && authHeaders.split(' ')[1];
    req.info = {}
    if(token == null){
       next()
    }
    else{
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err instanceof jwt.TokenExpiredError){
            return res.status(403).json({message: "Token expired"});
        }
        if(err){
            return res.status(403).json({message: err});
        }
        req.info = decoded;
       
        next();
    })
}

}