import ejs from 'ejs';

import sendMail from "./helper.js";



export const sendResetLink = async(email,username, link)=>{
    ejs.renderFile('./Templates/resetToken.ejs',{username, link},async(err,html)=>{
        if(err){

            console.log(err)
        }
        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Link',
            html
        }
        try{
            await sendMail(message);
            console.log("Email sent")
        }
        catch(err){
            console.log(err)
        }
    });

}