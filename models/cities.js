const mongoose = require('mongoose');

const citiesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const Cities = mongoose.model('Cities', citiesSchema);

module.exports = Cities;

