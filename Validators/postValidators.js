import Joi from 'joi'


const validatePostSchema = Joi.object({
    content: Joi.string().max(350).required(),
    image_url: Joi.string().allow(null)
})

export {validatePostSchema}