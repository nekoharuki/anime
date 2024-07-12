const express = require('express');
const router=express.Router({mergeParams:true});
const {reviewSchema}=require('../schema');
const Review=require('../rule/reviews');
const Rule = require('../rule/rule');
const AppError = require('../utils/erro');
const catchError = require('../utils/catcherr');
const categories = ['SF', 'コメディー', 'アクション'];

const validatereview=(req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

router.post('/',validatereview,catchError(async(req,res)=>{
    const watch=await Rule.findById(req.params.id);
    const review=new Review(req.body.review);
    watch.reviews.push(review);
    await review.save();
    await watch.save();
    res.redirect(`/anime/${watch._id}`);
}))
router.delete('/:reviewId',catchError(async(req,res)=>{
    const { reviewId,id } = req.params;
    await Rule.findByIdAndUpdate(id,{$pull :{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/anime/${id}`);

}))

module.exports=router;