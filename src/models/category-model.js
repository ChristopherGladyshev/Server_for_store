const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  name: { type: String, max: 100 },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean },
  date_of_creation: { type: String, default: new Date().toLocaleString('de-RU') }
});

ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

CategorySchema
  .virtual('url')
  .get(function () {
    return `/category?id=${this._id}`;
  });


module.exports = model('Category', CategorySchema);
