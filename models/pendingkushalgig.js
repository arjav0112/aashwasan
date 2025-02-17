const mongoose = require('mongoose');

const pendingKushalGigSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gigId: { type: String, required: true, unique: true },
    title: { type: String },
    description: { type: String },
    type: { type: String, enum: ['Digital', 'Handwritten', 'Coding', 'Other'], required: true },
    subject: { type: String },
    numberOfPages: { type: Number },
    topics: [{ type: String }],
    cost: { type: Number, required: true },
});

const PendingKushalGig = mongoose.model('PendingKushalGig', pendingKushalGigSchema);
module.exports = PendingKushalGig;
