// controllers/adminController.js
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Broker = require('../models/Broker');

exports.createQuiz = async (req, res, next) => {
    try {
        const { title, questions, assignedUsers, startTime, endTime } = req.body;
        if (!title || !questions || !assignedUsers) return res.status(400).json({ message: 'Invalid data' }); const quiz = await Quiz.create({ title, questions, assignedUsers, startTime, endTime }); res.status(201).json({ quizId: quiz._id });
    } catch (err) { next(err); }
};

exports.getAllQuizzes = async (req, res, next) => { try { res.json(await Quiz.find()); } catch (err) { next(err); } };
exports.updateQuiz = async (req, res, next) => { try { const q = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true }); if (!q) return res.status(404).json({ message: 'Not found' }); res.json(q); } catch (err) { next(err); } };
exports.deleteQuiz = async (req, res, next) => { try { const q = await Quiz.findByIdAndDelete(req.params.quizId); if (!q) return res.status(404).json({ message: 'Not found' }); res.json({ message: 'Deleted' }); } catch (err) { next(err); } };
exports.getAllResults = async (req, res, next) => { try { res.json(await Result.find().populate('user quiz')); } catch (err) { next(err); } };
exports.createBroker = async (req, res, next) => { try { const { username, password } = req.body; const b = await Broker.create({ username, password }); res.status(201).json({ username: b.username }); } catch (err) { next(err); } };
exports.deleteBroker = async (req, res, next) => { try { const b = await Broker.findOneAndDelete({ username: req.params.username }); if (!b) return res.status(404).json({ message: 'Not found' }); res.json({ message: 'Deleted' }); } catch (err) { next(err); } };
exports.getAllBrokers = async (req, res, next) => {
    try {
        const brokers = await Broker.find({}, '-password');
        res.json(brokers);
    } catch (err) {
        next(err);
    }
};