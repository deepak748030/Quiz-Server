const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({ questionText: String, options: [String], correctAnswer: String });
const quizSchema = new mongoose.Schema({
  title: String,
  questions: { type: [questionSchema] },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: Date,
  endTime: Date
}, { timestamps: true });
module.exports = mongoose.model('Quiz', quizSchema);
