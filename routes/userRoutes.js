// routes/userRoutes.js
const router = require('express').Router();
const { getAllUsers, getAllUsersActiveQuizzesByUserId, getAllQuizesScoredByUserId, loginUser, registerUser, verifyPayment } = require('../controllers/userController');
router.post('/login', loginUser);
router.post('/register', registerUser)
router.post('/verify-payment', verifyPayment);
router.get('/all-users', getAllUsers)
router.get('/users-active-quizes/:userId', getAllUsersActiveQuizzesByUserId);
router.get('/users-joined-quiz/:userId', getAllQuizesScoredByUserId);
module.exports = router;
