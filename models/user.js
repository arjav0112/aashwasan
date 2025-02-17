const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const registerUserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, default: uuidv4 },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // isVerified: { type: Boolean, default: false }
});


registerUserSchema.pre('save', function (next) {
    if (!this.userId) {
        this.userId = uuidv4(); // Generate a UUID if userId is not provided
    }
    next();
});

const registerUser = mongoose.model('registerUser', registerUserSchema);

module.exports = registerUser;
