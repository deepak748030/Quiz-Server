const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username:   { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  school:     { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
