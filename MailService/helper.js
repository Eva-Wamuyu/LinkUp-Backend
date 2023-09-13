import { createTransport } from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config()

function createTransporter (config){
    return createTransport(config)
}

let config ={
    host: 'smtp.gmail.com',
    service:'gmail',
    port:587,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWD
    }
}

const sendMail = async(messageOptions)=>{
    let transporter = createTransporter(config);

    await transporter.verify()
    transporter.sendMail(messageOptions, (err, info)=>{
        if(err){
            console.log("Error"+err)
        }
    })
}

export default sendMail