const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  schoolName: String,
  board: String,
  percentage: String,
});

const addressSchema = new mongoose.Schema({
  permanent: String,
  current: String,
  pinCode: String,
  district: String,
  state: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guardianOrParent: { type: String, required: true },
  mobileNo: { type: String, required: true, unique: true },
  aadhaarNo: { type: String, required: true, unique: true },
  panCardNo: { type: String },
  dob: { type: String, required: true },
  verified: { type: Boolean, default: false },
  education: {
    tenth: educationSchema,
    twelfth: educationSchema,
    graduation: educationSchema,
  },
  address: addressSchema,

}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
