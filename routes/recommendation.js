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

    const categorizing_metric = (metricKey, score) => {
      let level = ''
      switch (metricKey) {
        case "acne":
          if (score > 90 && score <= 100) {
            level = 'High'
          } else if (score > 70 && score <=90) {
            level = 'Medium'
          } else if (score > 30 && score <=71) {
            level = 'Poor'
          } else if (score >= 0 && score <=30) {
            level = 'Bad'
          }
          break;
        case "pigmentation":
          if (score > 90 && score <= 100) {
            level = 'High'
          } else if (score > 70 && score <=90) {
            level = 'Medium'
          } else if (score > 30 && score <=71) {
            level = 'Poor'
          } else if (score >= 0 && score <=30) {
            level = 'Bad'
          }
          break;
        case "uniformness":
          if (score > 90 && score <= 100) {
            level = 'High'
          } else if (score > 70 && score <=90) {
            level = 'Medium'
          } else if (score > 30 && score <=71) {
            level = 'Poor'
          } else if (score >= 0 && score <=30) {
            level = 'Bad'
          }
          break;
        case "pores":
          if (score > 90 && score <= 100) {
            level = 'High'
          } else if (score > 70 && score <= 90) {
            level = 'Medium'
          } else if (score > 30 && score <= 70) {
            level = 'Poor'
          } else if (score >= 0 && score <=30) {
            level = 'Bad'
          }
          break;
        case "redness":
          if (score > 80 && score <= 100) {
            level = 'High'
          } else if (score > 60 && score <=80) {
            level = 'Medium'
          } else if (score > 40 && score <=60) {
            level = 'Poor'
          } else if (score >= 0 && score <=40) {
            level = 'Bad'
          }
          break;
        case "skinTone":
          if (score > 60 && score <= 90) {
            level = 'High';
          } else if (score > 30 && score <= 60) {
            level = 'Medium';
          } else if (score > -29 && score <= 30) {
            level = 'Poor';
          } else if (score >= -90 && score <= -30) {
            level = 'Bad';
          }
          break;
        case "lines":
          if (score > 95 && score <= 100) {
            level = 'High'
          } else if (score > 90 && score <= 95) {
            level = 'Medium'
          } else if (score > 80 && score <= 90) {
            level = 'Poor'
          } else if (score >= 0 && score <= 80) {
            level = 'Bad'
          }
          break;
        case "hydration":
          if (score > 90 && score <=100) {
            level = 'High'
          } else if (score > 70 && score <=90) {
            level = 'Medium'
          } else if (score > 30 && score <=70) {
            level = 'Poor'
          } else if (score >= 0 && score <=30) {
            level = 'Bad'
          }
          break;
        case "darkCircle":
          if (score > 90 && score <= 100) {
            level = 'High'
          } else if (score > 70 && score <= 90) {
            level = 'Medium'
          } else if (score > 55 && score <= 70) {
            level = 'Poor'
          } else if (score >= 0 && score <= 55) {
            level = 'Bad'
          }
          break;
        default:
        // code block
      }
      return level;
    };

    const primaryRecommendation = await Recommendations.find({
      metric: Object.keys(primaryConcern)[0],
      metric_level: categorizing_metric(Object.keys(primaryConcern)[0], Object.values(primaryConcern)[0]),
      gender: gender,
      pregnancy: pregnancy,
      skin_type: skin_type,
      skin_sensitivity: skin_sensitivity
    });

    const secondaryRecommendation = await Recommendations.find({
      metric: Object.keys(secondaryConcern)[0],
      metric_level: categorizing_metric(Object.keys(secondaryConcern)[0], Object.values(secondaryConcern)[0]),
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
    res.json({ "primaryProduct": primaryProduct, "secondaryProduct": secondaryProduct });
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