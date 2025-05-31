const mongoose = require('mongoose');
const moment = require('moment-timezone');
const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [String],
  score: Number,
  submittedAt: { type: Date, default: () => moment.tz('Asia/Kolkata').toDate() }
}, { timestamps: true });
module.exports = mongoose.model('Result', resultSchema);
