const mongoose = require('mongoose');

const kushalGigSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gigId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    dueDate: { type: Date },
    type: { type: String, enum: ['Digital', 'Handwritten', 'Coding', 'Other'], required: true },
    subject: { type: String, required: true },
    numberOfPages: { type: Number, required: true },
    topics: [{ type: String }],
    cost: { type: Number, required: true },
});

const KushalGig = mongoose.model('KushalGig', kushalGigSchema);
module.exports = KushalGig;

