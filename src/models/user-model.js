const { Schema, model } = require('mongoose');
const product = require('./product-model');

const UserSchema = new Schema({
  first_name: { type: String, max: 100 },
  family_name: { type: String, max: 100 },
  age: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  is_activated: { type: Boolean, default: false },
  activation_link: { type: String },
  update: { type: String, default: new Date().toLocaleString('de-RU') },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  access_level: { type: Number, default: 000 }
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema
  .virtual('fullName')
  .get(function () {
    if (!(this.first_name && this.family_name)) return;
    return `${this.first_name} ${this.family_name}`;
  });

UserSchema
  .virtual('url')
  .get(function () {
    return `/author?id=${this._id}`;
  });

module.exports = model('User', UserSchema);
