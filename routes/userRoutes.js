// routes/userRoutes.js
const router = require('express').Router();
const { loginAndFetch, getAllUsers, getAllUsersActiveQuizzesByUserId, getAllQuizesScoredByUserId } = require('../controllers/userController');
router.post('/login', loginAndFetch);
router.get('/all-users', getAllUsers)
router.get('/users-active-quizes/:userId', getAllUsersActiveQuizzesByUserId);
router.get('/users-joined-quiz/:userId', getAllQuizesScoredByUserId);
module.exports = router;
