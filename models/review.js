const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    userid: { type: Number,required: true },
    businessid: { type: Number,required: true },
    dollars: { type: Number,required: true },
    stars: { type: Number,required: true },
    review: { type: String,required: false }
  
});
const Review = mongoose.model('review', reviewSchema);
module.exports = Review;