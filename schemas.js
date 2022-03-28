const Joi = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        discount: Joi.number().required().min(1).max(100)
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})