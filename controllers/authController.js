// controllers/authController.js
const jwt=require('jsonwebtoken');
const Broker=require('../models/Broker');
const AdminCreds={ username:'admin', password:'admin123' };

exports.adminLogin=(req,res)=>{
  const {username,password}=req.body;
  if(username===AdminCreds.username && password===AdminCreds.password){
    const token=jwt.sign({role:'admin'},process.env.JWT_SECRET,{expiresIn:'2h'});
    return res.json({token});
  }
  res.status(401).json({message:'Invalid admin credentials'});
};

exports.brokerLogin=async(req,res,next)=>{
  try{
    const {username,password}=req.body;
    const broker=await Broker.findOne({username});
    if(!broker)return res.status(401).json({message:'Invalid credentials'});
    const match=await require('bcrypt').compare(password,broker.password);
    if(!match)return res.status(401).json({message:'Invalid credentials'});
    const token=jwt.sign({id:broker._id,role:'broker'},process.env.JWT_SECRET,{expiresIn:'2h'});
    res.json({token});
  }catch(err){next(err);}
};
