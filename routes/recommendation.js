const express = require('express')
const router = express.Router();
const Minimalist = require("../model/minimalist");
const Recommendations = require("../model/recommendations");
const Product = require("../model/products");

router.post('/', async (req, res) => {
  try {
    // const { gender, pregnancy, skin_type, skin_sensitivity, metric, metric_level } = await Minimalist.findById(req.body);
    const { gender, pregnancy, skin_type, skin_sensitivity, primary_concern, secondary_concern } = req.body;
    const primaryConcern = primary_concern[0];
    const secondaryConcern = secondary_concern[0];
    const primaryRecommendation = await Recommendations.find({
      metric: Object.keys(primaryConcern)[0],
      metric_level: Object.values(primaryConcern)[0],
      gender: gender,
      pregnancy: pregnancy,
      skin_type: skin_type,
      skin_sensitivity: skin_sensitivity
    });

    const secondaryRecommendation = await Recommendations.find({
      metric: Object.keys(secondaryConcern)[0],
      metric_level: Object.values(secondaryConcern)[0],
      gender: gender,
      pregnancy: pregnancy,
      skin_type: skin_type,
      skin_sensitivity: skin_sensitivity
    });

    if (!primaryRecommendation && !secondaryRecommendation) {
      return res.status(404).json({ message: 'No recommendation found' });
    }

    const primaryCleanser = await Product.find({
      title: primaryRecommendation[0].cleanser
    })

    const primaryToner = await Product.find({
      title: primaryRecommendation[0].toner
    })

    const primaryTreatment = await Product.find({
      title: primaryRecommendation[0].treatment
    })

    const primaryMoisturizer = await Product.find({
      title: primaryRecommendation[0].moisturizer
    })

    const primarySunscreen = await Product.find({
      title: primaryRecommendation[0].sunscreen
    })    

    const secondaryCleanser = await Product.find({
      title: secondaryRecommendation[0].cleanser
    })

    const secondaryToner = await Product.find({
      title: secondaryRecommendation[0].toner
    })

    const secondaryTreatment = await Product.find({
      title: secondaryRecommendation[0].treatment
    })

    const secondaryMoisturizer = await Product.find({
      title: secondaryRecommendation[0].moisturizer
    })

    const secondarySunscreen = await Product.find({
      title: secondaryRecommendation[0].sunscreen
    })

    const primaryProduct = {
      Cleanser: primaryCleanser,
      Toner: primaryToner,
      Treatment: primaryTreatment,
      Moisturizer: primaryMoisturizer,
      Sunscreen: primarySunscreen
    }    

    const secondaryProduct = {
      Cleanser: secondaryCleanser,
      Toner: secondaryToner,
      Treatment: secondaryTreatment,
      Moisturizer: secondaryMoisturizer,
      Sunscreen: secondarySunscreen
    }

    // Send the recommendation as a response
    res.json({"primaryProduct": primaryProduct,"secondaryProduct": secondaryProduct});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

router.get('/', async (req, res) => {
  const recommendation = await Recommendations.find();
  // const { gender, pregnancy, skinType, skinSensitivity } = minimalist;
  res.status(201).json(recommendation);
})

router.post('/', async (req, res) => {
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
    res.status(400).json({ msg: err.message })
  }
})

module.exports = router