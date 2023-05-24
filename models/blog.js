const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  date_of_creation: { type: Date, default: Date.now },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

// virtual for user's URL
BlogSchema.virtual('url').get(function () {
  return `/blog/${this._id}`;
});

module.exports = mongoose.model('Blog', BlogSchema);