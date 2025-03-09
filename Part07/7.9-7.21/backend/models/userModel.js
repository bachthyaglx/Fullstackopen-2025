const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
});

module.exports = mongoose.model('User', userSchema);
