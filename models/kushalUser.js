const mongoose = require('mongoose');
// const moment = require('moment-timezone');
const { DateTime } = require('luxon');
const KushalUserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    joinDate: {
        type: String,
        default: () => {
            return DateTime.now().setZone('Asia/Kolkata').toFormat('dd-MM-yyyy HH:mm:ss'); // Convert to desired format
        }
    },
    joinedMonthAndYear: { type: String },
    isProfileCreated: { type: Boolean, default: false },
    kushalId: { type: String, unique: true, required: true }
});
// Generate joinedMonthAndYear based on joinDate
KushalUserSchema.pre('save', function (next) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const joinDate = new Date(this.joinDate);
    const month = months[joinDate.getMonth()];
    const year = joinDate.getFullYear();
    this.joinedMonthAndYear = `${month} ${year}`;
    next();
});

const KushalUser = mongoose.model('KushalUser', KushalUserSchema);

module.exports = KushalUser;
