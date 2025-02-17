const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 120 }, // TTL index to auto-delete after 10 minutes
    lastSent: { type: Date, default: Date.now } // Timestamp for the last sent OTP
});

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;
