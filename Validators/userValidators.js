import Joi from "joi"


const validateRegisterSchema = Joi.object({
    username: Joi.string()
        .required()
        .min(3)
        .pattern(new RegExp('^[a-zA-Z][a-zA-Z0-9_]*$'))
        .messages({
            'string.base': 'Invalid Name Format',
            'string.empty': 'Username is required',
            'string.min': 'Username must have at least 3 characters',
            'string.pattern.base': 'Username can only start with a letter and can only contain numbers, letters and underscores-No Spaces'
        }),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
        .messages({
            'string.base': 'Email should be in the right format',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^.{6}$'))
        .messages({
            'password.base': 'Password should be a string',
            'password.empty': 'Password is required',
            'password.pattern.base': 'Password must be at least 6 characters long'
        }),
    
});

const validateloginSchema = Joi.object({
    emailOrUsername: Joi.string().required().messages({
        'emailOrUsername.empty': 'Email or username is required',
       
    }),
    password: Joi.string().required().messages({
        'password.empty': 'Password is required',
    }),
    
})


export {validateRegisterSchema,validateloginSchema};