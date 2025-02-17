const mongoose = require('mongoose');


// Define User Schema and Model
const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, required: true },
    phoneNumber: { type: String },
    emailVerified: { type: Boolean, required: true },
    joinDate: { type: Date, default: () => new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}) }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;