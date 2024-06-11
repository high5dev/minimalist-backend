const mongoose = require('mongoose');

const hautScoreSchema = new mongoose.Schema({
    redness: {
        type: String,
        required: true
    },
    uniformness: {
        type: String,
        required: true
    },
    pigmentation: {
        type: String,
        required: true
    },
    skinTone: {
        type: String,
        required: true
    },
    lines: {
        type: String,
        required: true
    },
    eyeAge: {
        type: String,
        required: true
    },
    acne: {
        type: String,
        required: true
    },
    pores: {
        type: String,
        required: true
    },
    eyeBags: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    translucency: {
        type: String,
        required: true
    },
    hydration: {
        type: String,
        required: true
    },

});


module.exports = mongoose.model('hautScores', hautScoreSchema);
