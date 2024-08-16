import Joi from "joi"


const validateRegisterSchema = Joi.object({
    username: Joi.string()
        .required()
        .min(3)
        .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/)
        .messages({
            'string.base': 'Invalid Name Format',
            'string.empty': 'Username is required',
            'string.min': 'Username must have at least 3 characters',
            'string.pattern.base': 'Username can only start with a letter and can only contain numbers, letters and underscores-No Spaces'
        }),
    email: Joi.string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/
        )
        .required()
        .messages({
            'string.base': 'Email should be in the right format',
            'string.empty': 'Email is required',
            'string.pattern.base': 'Email must be a valid email address'
        }),
    password: Joi.string()
        .required()
        .min(6)
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
    bio: Joi.string().allow(null, ' ').max(100).messages({
        'string.max': 'Bio is too long,max is 100 characters',
    }),
    profile_image: Joi.string().allow(null)
    
})


const validateResetEmail = Joi.object({
    email: Joi.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/
    )
    .required()
    .messages({
        'string.base': 'Email should be in the right format',
        'string.empty': 'Email is required',
        'string.pattern.base': 'Email must be a valid email address'
    }),
})


export {validateRegisterSchema,validateloginSchema,validateUpdateSchema,validateResetEmail};