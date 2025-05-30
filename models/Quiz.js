const mongoose = require('mongoose');

// Helper to convert any date to IST
function toIST(date) {
  if (!date) return date;
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  return new Date(new Date(date).getTime() + istOffset);
}

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: { type: [questionSchema] },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: {
    type: Date,
    set: toIST
  },
  endTime: {
    type: Date,
    set: toIST
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
