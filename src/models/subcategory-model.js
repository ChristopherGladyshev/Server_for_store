const { Schema, model } = require('mongoose');


const SubcategorySchema = new Schema({
  name: { type: String, max: 100 },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
});

SubcategorySchema.set('toObject', { virtuals: true });
SubcategorySchema.set('toJSON', { virtuals: true });

SubcategorySchema
  .virtual('url')
  .get(function () {
    return `/subcategory?id=${this._id}`;
  });

module.exports = model('SubcategorySchema', SubcategorySchema);
