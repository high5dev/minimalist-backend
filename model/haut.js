const mongoose = require('mongoose');

const hautAPISchema = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    company_id: {
        type: String,
    },
    dataset_id: {
        type: String,
    },
    subject_id: {
        type: String,
    },
    batch_id: {
        type: String,
    },
    image_id: {
        type: String,
    },
})


module.exports = mongoose.model('hautAPIs', hautAPISchema);