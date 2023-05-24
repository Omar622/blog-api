const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String, required: true, unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true, maxLength: 100 },
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_creation: { type: Date, default: Date.now },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// virtual for user's full name
UserSchema.virtual('name').get(function () {
  return `${this.first_name}, ${this.last_name}`;
});

// virtual for user's URL
UserSchema.virtual('url').get(function () {
  console.log(this);

  return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);