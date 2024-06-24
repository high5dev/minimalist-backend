const express = require('express')
const router = express.Router();
const Minimalist = require("../model/minimalist");
const Recommendations = require("../model/recommendations");

router.post('/', async(req, res) => {
    const { gender, pregnancy, skinType, skinSensitivity } = await Minimalist.findById(req.body.id);
    console.log(gender, pregnancy)
})

router.get('/', async(req, res) => {
    const recommendation = await Recommendations.find();
    // const { gender, pregnancy, skinType, skinSensitivity } = minimalist;
    res.status(201).json(recommendation);
})

router.post('/', async(req, res) => {
    const recommendation = new Recommendations({
        gender: req.body.gender,
        skin_type: req.body.skin_type,
        skin_sensitivity: req.body.skin_sensitivity,
        pregnancy: req.body.pregnancy,
        products: req.body.products,
        metric: req.body.metric,
        metric_leve: req.body.metric_leve
    });
    try {
        const newRecommendation = await recommendation.save();
        res.status(201).json(newRecommendation);
    } catch (err) {
        res.status(400).json({msg: err.message})
    }
})

module.exports = router