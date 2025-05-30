// controllers/brokerController.js
const Broker=require('../models/Broker');
const User=require('../models/User');
const Quiz=require('../models/Quiz');
const Result=require('../models/Result');

exports.createUser=async(req,res,next)=>{try{const{username,rollNumber,school}=req.body; if(!username||!rollNumber||!school)return res.status(400).json({message:'Missing fields'}); const user=await User.create({username,rollNumber,school}); res.status(201).json(user);}catch(err){next(err);}};
exports.getQuizzes=async(req,res,next)=>{try{res.json(await Quiz.find());}catch(err){next(err);}};
exports.getResults=async(req,res,next)=>{try{res.json(await Result.find().populate('user quiz'));}catch(err){next(err);}};
exports.updatePassword=async(req,res,next)=>{try{const{oldPassword,newPassword}=req.body; const broker=await Broker.findById(req.user.id); const match=await require('bcrypt').compare(oldPassword,broker.password); if(!match)return res.status(401).json({message:'Wrong password'}); broker.password=newPassword;await broker.save(); res.json({message:'Updated'});}catch(err){next(err);}};
