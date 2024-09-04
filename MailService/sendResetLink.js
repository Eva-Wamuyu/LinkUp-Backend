import ejs from 'ejs';

import sendMail from "./helper.js";



export const sendResetLink = async (email, username, link) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile('./Templates/resetToken.ejs', { username, link }, async (err, html) => {
            if (err) {
                return reject (new Error('Error rendering template')); 
            }
            const message = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Password Reset Link',
                html
            };
            try {
                await sendMail(message);
                console.log("Email sent");
                resolve(); 
            } catch (err) {
                console.error("Send Reset Link>>", err);
                return reject (new Error('Error sending email')); 
            }
        });
    });
};
