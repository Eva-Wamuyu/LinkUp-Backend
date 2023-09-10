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
            'string.base': 'Password should be a string',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be at least 6 characters long'
        }),
    
});

const validateloginSchema = Joi.object({
    emailOrUsername: Joi.string().required().messages({
        'string.empty': 'Email or username is required',
       
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
    
})

const validateUpdateSchema = Joi.object({
    bio: Joi.string().max(100).messages({
        'string.max': 'Bio is too long,max is 100 characters',
    }),
    profile_img: Joi.string()
    
})


export {validateRegisterSchema,validateloginSchema,validateUpdateSchema};