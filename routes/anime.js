const express = require('express');
const router=express.Router();
const catchError = require('../utils/catcherr');

const Rule = require('../rule/rule');
const AppError = require('../utils/erro');

const categories = ['SF', 'コメディー', 'アクション'];
const {watchSchema}=require('../schema');


const validatewatch=(req,res,next)=>{
    const { error } = watchSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchError(async (req, res) => {
    const { category } = req.query
    let watch;
    if (category) {
        watch = await Rule.find({ category })
    } else {
        watch = await Rule.find();
    }
    res.render('collect/index', { watch, category: category || '全' });
}));

router.get('/new', (req, res) => {
    res.render('collect/new');
});

router.post('/', validatewatch, catchError(async (req, res, next) => {
    const watch = new Rule(req.body.watch);
    await watch.save();
    res.redirect(`/anime/${watch._id}`);
}));

router.get('/:id/edit', catchError(async (req, res) => {
    const watch = await Rule.findById(req.params.id);
    res.render('collect/edit', { watch, categories });
}));


router.put('/:id', validatewatch, catchError(async (req, res) => {
    const { id } = req.params;
    const watch = await Rule.findByIdAndUpdate(id, req.body.watch, { runValidators: true, new: true });
    res.redirect(`/anime/${watch._id}`);
}));

router.get('/:id', catchError(async (req, res, next) => {
    const { id } = req.params;
    const watch = await Rule.findById(id).populate('reviews');
    if (!watch) {
        throw new AppError('商品がみつかりません', 404);
    }
    res.render('collect/detail', { watch });
}));

router.delete('/:id', catchError(async (req, res) => {
    const { id } = req.params;
    await Rule.findByIdAndDelete(id);
    res.redirect('/anime');
}));

module.exports=router;