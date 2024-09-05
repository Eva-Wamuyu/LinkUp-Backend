import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const extractToken = (req)=>{

    const authHeaders = req.headers['authorization'];
    return authHeaders && authHeaders.split(' ')[1];
}


export const generateAccessToken = (user) => {
    const payload = {
        issuer: user.user_id,
        subject: user.username 
    }
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: '48h',
        "algorithm":"HS256"
    })
}

export const authenticateToken = (req,res,next)=>{
    const token = extractToken(req);
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
    
    const token = extractToken(req);
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