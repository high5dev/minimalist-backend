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
    
    const fetchProduct = async (title) => {
      if (!title) return null;
      return await Product.find({ title });
    };

    const primaryProduct = {
      Cleanser: await fetchProduct(primaryRecommendation[0]?.cleanser),
      Toner: await fetchProduct(primaryRecommendation[0]?.toner),
      Treatment: await fetchProduct(primaryRecommendation[0]?.treatment),
      Moisturizer: await fetchProduct(primaryRecommendation[0]?.moisturizer),
      Sunscreen: await fetchProduct(primaryRecommendation[0]?.sunscreen),
    }    

    const secondaryProduct = {
      Cleanser: await fetchProduct(secondaryRecommendation[0]?.cleanser),
      Toner: await fetchProduct(secondaryRecommendation[0]?.toner),
      Treatment: await fetchProduct(secondaryRecommendation[0]?.treatment),
      Moisturizer: await fetchProduct(secondaryRecommendation[0]?.moisturizer),
      Sunscreen: await fetchProduct(secondaryRecommendation[0]?.sunscreen),
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
  res.status(201).json(recommendation);
})

module.exports = router