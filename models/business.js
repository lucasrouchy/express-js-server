const mongoose = require('mongoose');
const businessSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    ownerid: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String,required: true },
    state: { type: String,required: true },
    zip: { type: Number,required: true },
    phone: { type: Number,required: true },
    category: { type: String,required: true },
    subcategory: { type: String,required: true },
    website: { type: String,required: false },
    email: { type: String,required: false }  
});
const Business = mongoose.model('businesses', businessSchema);
module.exports = Business;