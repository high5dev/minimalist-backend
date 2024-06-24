const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendationSchema = new Schema({
  gender: { type: String, required: true},
  pregnancy: { type: String, required: true},
  skin_type: { type: String, required: true},
  metric: {type: String},
  metric_level: {type: String},
  skin_sensitivity: { type: String, required: true},
  cleanser: { type: String},
  toner: { type: String},
  treatment: { type: String},
  moisturizer: { type: String},
  sunscreen: { type: String},
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;