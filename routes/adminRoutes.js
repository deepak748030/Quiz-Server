// routes/adminRoutes.js
const router = require('express').Router();
const { verifyJWT } = require('../middleware/auth');
const { createQuiz, getAllQuizzes, updateQuiz, deleteQuiz, getAllResults, createBroker, deleteBroker, getAllBrokers } = require('../controllers/adminController');
router.use(verifyJWT);
router.post('/quizzes', createQuiz);
router.get('/quizzes', getAllQuizzes);
router.put('/quizzes/:quizId', updateQuiz);
router.delete('/quizzes/:quizId', deleteQuiz);
router.get('/results', getAllResults);
router.post('/brokers', createBroker);
router.get('/brokers', getAllBrokers);
router.delete('/brokers/:username', deleteBroker);
module.exports = router;
