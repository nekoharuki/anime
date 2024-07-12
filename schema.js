const joi=require('joi');

    module.exports.watchSchema = joi.object({
        watch: joi.object({
            name: joi.string().required(),
            evaluation: joi.number().required(),
            category: joi.string().required(),
            story: joi.string().required(),
            image: joi.string().required()
        }).required()
 
    })

module.exports.reviewSchema=joi.object({
    review :joi.object({
        rating:joi.number().required().min(1).max(5),
        body:joi.string().required()
    }).required()
})