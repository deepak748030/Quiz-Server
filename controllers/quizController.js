// controllers/quizController.js
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

exports.getActiveQuiz = async (req, res, next) => {
  try {
    let user = await User.findOne({ rollNumber: req.params.rollNumber });
    if (!user) user = await User.create({ rollNumber: req.params.rollNumber, username: req.params.rollNumber, school: '' });
    const now = new Date();
    const quizzes = await Quiz.find({ assignedUsers: user._id, startTime: { $lte: now }, endTime: { $gte: now } });
    const results = await Result.find({ user: user._id, quiz: { $in: quizzes.map(q => q._id) } });
    const takenIds = results.map(r => r.quiz.toString());
    const available = quizzes.filter(q => !takenIds.includes(q._id.toString()));
    if (!available.length) return res.status(404).json({ message: 'No active or all completed' });
    const q = available[0];
    res.json({ quizId: q._id, title: q.title, questions: q.questions.map(x => ({ questionText: x.questionText, options: x.options })) });
  } catch (err) { next(err); }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params; const { rollNumber, answers } = req.body;
    if (!rollNumber || !answers) return res.status(400).json({ message: 'Invalid submission' });
    const user = await User.findOne({ rollNumber }); if (!user) return res.status(404).json({ message: 'User not found' });
    const quiz = await Quiz.findById(quizId); if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const now = new Date(); if (now < quiz.startTime || now > quiz.endTime) return res.status(403).json({ message: 'Quiz inactive' });
    if (await Result.findOne({ user: user._id, quiz: quiz._id })) return res.status(403).json({ message: 'Quiz already taken' });
    let score = 0; quiz.questions.forEach((q, i) => { if (q.correctAnswer === answers[i]) score++ });
    const result = await Result.create({ user: user._id, quiz: quiz._id, answers, score });
    res.json({ score, resultId: result._id });
  } catch (err) { next(err); }
};

exports.updateQuizByQuizId = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const updateData = req.body;
    const quiz = await Quiz.findByIdAndUpdate(quizId, updateData, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz updated', quiz });
  } catch (err) {
    next(err);
  }
};
