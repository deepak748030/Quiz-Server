// controllers/userController.js
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, guardianOrParent, mobileNo, aadhaarNo, panCardNo, dob, education, address } = req.body;

    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
      name,
      guardianOrParent,
      mobileNo,
      aadhaarNo,
      panCardNo,
      dob,
      education,
      address,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// LOGIN (create if not found)
exports.loginUser = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    const user = await User.findOne({ mobileNo });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v'); // Exclude __v field
    res.json(users);
  } catch (err) {
    next(err);
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v'); // Exclude __v field
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsersActiveQuizzesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    // Get current time in Asia/Kolkata timezone in 'YYYY-MM-DDTHH:mm' format
    const nowIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const dateObj = new Date(nowIST);
    const pad = n => n.toString().padStart(2, '0');
    const nowISTString = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
    console.log(nowISTString)
    const activeQuizzes = await Quiz.find({
      assignedUsers: { $in: [userId] },
      startTime: { $lte: nowISTString },
      endTime: { $gte: nowISTString }
    }).select('title startTime endTime');
    console.log(activeQuizzes)
    res.json({ activeQuizzes });
  } catch (err) {
    next(err);
  }
};

exports.getAllQuizesScoredByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const results = await Result.find({ user: userId })
      .populate('quiz', 'title startTime endTime')
      .select('score submittedAt quiz');

    res.json({ scoredQuizzes: results });
  } catch (err) {
    next(err);
  }
};



