const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    deviceToken: { type: String, required: true,},
    lastTokenSaveTime: { type: Date, default: Date.now },
});

const DeviceToken = mongoose.model('DeviceToken', deviceTokenSchema);

module.exports = DeviceToken;
