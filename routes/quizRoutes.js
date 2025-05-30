// routes/quizRoutes.js
const router = require('express').Router();
const { getActiveQuiz, submitQuiz, updateQuizByQuizId } = require('../controllers/quizController');
router.get('/active/:rollNumber', getActiveQuiz);
router.post('/:quizId/submit', submitQuiz);
router.patch('/:quizId', updateQuizByQuizId)
module.exports = router;
