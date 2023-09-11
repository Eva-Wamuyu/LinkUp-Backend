import Joi from 'joi'


const validateCommentSchema = Joi.object({
    content: Joi.string().max(280).required()
    
})

export {validateCommentSchema}