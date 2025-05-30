// routes/authRoutes.js
const router=require('express').Router();
const { adminLogin, brokerLogin }=require('../controllers/authController');
router.post('/admin/login',adminLogin);
router.post('/broker/login',brokerLogin);
module.exports=router;
