const mongoose = require('mongoose');

const gigUserProfileSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    city: { type: String, required: true },
    college: { type: String, required: true },
    courseName: { type: String, required: true },
    kushalId: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    joinedMonthAndYear: { type: String },
    joinDate: {
        type: String, required: true, unique: true
    },
});

const GigUserProfile = mongoose.model('GigUserProfile', gigUserProfileSchema);
module.exports = GigUserProfile;
