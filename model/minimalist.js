const mongoose = require('mongoose');

const hautSchema = new mongoose.Schema({
    redness: {
        type: String,
    },
    uniformness: {
        type: String,
    },
    pigmentation: {
        type: String,
    },
    skinTone: {
        type: String,
    },
    lines: {
        type: String,
    },
    wrinkles: {
        type: String,
    },
    perceivedAge: {
        type: String,
    },
    eyeAge: {
        type: String,
    },
    acne: {
        type: String,
    },
    pores: {
        type: String,
    },
    lacrimaGroove: {
        type: String,
    },
    eyeBags: {
        type: String,
    },
    sagging: {
        type: String,
    },
    translucency: {
        type: String,
    },
    hydration: {
        type: String,
    },
    darkCircle: {
        type: String,
    },
    facialLandmarks: {
        type: String,
    },
    lowestMetric: { type: Object },
    secondLowestMetric: { type: Object },

}, { _id: false });

const productSchema = new mongoose.Schema({
    title: {
        type: String
    },
    imageUri: {
        type: String
    },
    whenToUse: {
        type: String
    },
    price: {
        type: String
    },
    productType: {
        type: String
    },
    handle: {
        type: String
    },
    status: {
        type: String
    }
}, { _id: false })

const recommendedProductSchema = new mongoose.Schema({
    Cleanser: { type: [productSchema] },
    Toner: { type: [productSchema] },
    Treatment: { type: [productSchema] },
    Moisturizer: { type: [productSchema] },
    Sunscreen: { type: [productSchema] }
}, { _id: false })

const minimalistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    pregnancy: {
        type: String,
        required: true
    },
    skinType: {
        type: String,
        required: true
    },
    skinSensitivity: {
        type: String,
        required: true
    },
    imageUri: {
        type: String
    },
    haut: {
        type: [hautSchema],
    },
    primaryConcernProduct: {
        type: recommendedProductSchema
    },
    secondaryConcerProduct: {
        type: recommendedProductSchema
    }
});

module.exports = mongoose.model('Minimalist', minimalistSchema);