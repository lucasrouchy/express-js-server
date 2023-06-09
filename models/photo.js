const mongoose = require('mongoose');
const photoSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    userid: { type: Number,required: true },
    businessid: { type: Number,required: true },
    caption: { type: String,required: false },
    file: { type: Buffer,required: true }
});
const Photo = mongoose.model('photo', photoSchema);
module.exports = Photo;