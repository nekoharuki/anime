const mongoose = require('mongoose');
const review = require('./reviews');

const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    evaluation: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    category: {
        type: String,
        enum: ['SF', 'アクション', 'コメディー'],
        required: true
    },
    story: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

ruleSchema.post('findOneAndDelete', async function(o){
    if(o){
        await review.deleteMany({
            _id:{
                $in:o.reviews
            }
        })
    }
})

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;
