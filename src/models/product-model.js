const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  title: { type: String, max: 100, required: true },
  description: { type: String, max: 200, required: true },
  product_text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  subcategory: {  },
  price: { type: Number },
  email_author: { type: String, unique: true },
  date_of_creation: { type: String, default: new Date().toLocaleString('de-RU') },
  images: [String],
  number_of_goods: { type: Number },
});

ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

ProductSchema
  .virtual('url')
  .get(function () {
    return `/product?id=${this._id}`;
  });

module.exports = model('Product', ProductSchema);
