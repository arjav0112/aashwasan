const mongoose = require('mongoose');

// const mongoose = require('mongoose');

let dataSchema = new mongoose.Schema({
    'pname': {
        type: String,
        required: true,
    },
    'pprice': {
        type: String,
        required: true,
    },
    'pdesc': {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("node_js", dataSchema)