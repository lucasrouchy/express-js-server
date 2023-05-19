const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String,required: true },
    password: { type: String,required: true },
    admin: { type: Boolean,required: true }
});
const User = mongoose.model('users', userSchema);
module.exports = User;