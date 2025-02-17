const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const GoogleUserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const GoogleUser = mongoose.model('GoogleUser', GoogleUserSchema);

module.exports = GoogleUser;

// password: { type: String, required: true },
// isVerified: { type: Boolean, default: false }


// GoogleUserSchema.pre('save', function (next) {
//     if (!this.userId) {
//         this.userId = uuidv4(); // Generate a UUID if userId is not provided
//     }
//     next();
// });