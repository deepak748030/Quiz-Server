// routes/brokerRoutes.js
const router = require('express').Router();
const { verifyJWT } = require('../middleware/auth');
const { createUser, getQuizzes, getResults, updatePassword } = require('../controllers/brokerController');
const { getAllUsers } = require('../controllers/userController');
router.use(verifyJWT);
router.post('/create-user', createUser);
router.get('/quizzes', getQuizzes);
router.get('/results', getResults);
router.get('/users', getAllUsers);
router.patch('/password', updatePassword);
module.exports = router;
