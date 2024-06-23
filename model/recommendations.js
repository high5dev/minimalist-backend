const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  cleanser: { type: String},
  toner: { type: String},
  treatment: { type: String},
  moisturizer: { type: String},
  sunscreen: { type: String},
}, { _id: false });

const recommendationSchema = new Schema({
  gender: { type: String, required: true},
  pregnancy: { type: String, required: true},
  skin_type: { type: String, required: true},
  metric: {type: String},
  metric_leve: {type: String},
  skin_sensitivity: { type: String, required: true},
  products: { type: productSchema, required: true }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;