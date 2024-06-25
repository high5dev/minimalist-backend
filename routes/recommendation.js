const express = require('express')
const router = express.Router();
const Minimalist = require("../model/minimalist");
const Recommendations = require("../model/recommendations");

router.post('/', async(req, res) => {
    try {
        // const { gender, pregnancy, skin_type, skin_sensitivity, metric, metric_level } = await Minimalist.findById(req.body);
        const { gender, pregnancy, skin_type, skin_sensitivity, metric, metric_level } = req.body;
        const recommendation = await Recommendations.find({
            metric: metric,
            metric_level: metric_level,
            gender: gender,
            pregnancy: pregnancy,
            skin_type: skin_type,
            skin_sensitivity: skin_sensitivity
          });
          console.log(recommendation);
          if (!recommendation) {
            return res.status(404).json({ message: 'No recommendation found' });
          }

          const product = {
            Cleanser: recommendation.cleanser,
            Toner: recommendation.toner,
            Treatment: recommendation.treatment,
            Moisturizer: recommendation.moisturizer,
            Sunscreen: recommendation.sunscreen
          }
      
          // Send the recommendation as a response
          res.json(product);        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
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