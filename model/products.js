const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: { type: String, required: true},
  handle: { type: String, required: true},
  status: { type: String, required: true},
  productType: {type: String},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;