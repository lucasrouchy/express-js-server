const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    userid: { type: Number,required: true },
    businessid: { type: Number,required: true },
    rating: { type: Number,required: true },
    review: { type: String,required: false }
  
});
Review = mongoose.model('review', reviewSchema);
module.exports = Review;