// controllers/userController.js
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Razorpay = require('razorpay')
const nodecache = require('node-cache');
const nodeCache = new nodecache({ stdTTL: 600 }); // 600 seconds = 10 minutes
const dotenv = require('dotenv');
dotenv.config();


const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret
});

// Register User & Create Razorpay Order
exports.registerUser = async (req, res) => {
  try {
    const { name, guardianOrParent, mobileNo, aadhaarNo, panCardNo, dob, education, address } = req.body;
    const verified = req.body.verified || false;
    console.log(verified)
    const existingUser = await User.findOne({ mobileNo, verified: true });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const exisingUnverifiedUser = await User.findOne({ mobileNo, verified: false });
    if (exisingUnverifiedUser) {
      await User.deleteOne({ _id: exisingUnverifiedUser._id });
    }

    const newUser = new User({
      name,
      guardianOrParent,
      mobileNo,
      aadhaarNo,
      panCardNo,
      dob,
      education,
      address,
      verified
    });

    await newUser.save();

    if (!newUser.verified) {
      const order = await razorpay.orders.create({
        amount: 20000, // in paise (₹200)
        currency: "INR",
        receipt: `user_reg_${newUser._id}`,
        payment_capture: 1
      });

      nodeCache.set(order.id, newUser._id.toString());

      return res.status(201).json({
        message: 'User registered (unverified)',
        user: {
          id: newUser._id,
          verified: newUser.verified,
          razorpay: order
        }
      });
    } else {
      return res.status(201).json({ message: 'User registered', user: newUser });
    }

  } catch (err) {
    console.error('Registration failed:', err);
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0];
      const message = duplicatedField === 'mobileNo'
        ? 'Mobile number already exists'
        : duplicatedField === 'aadhaarNo'
          ? 'Aadhaar number already exists'
          : 'Duplicate field error';
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: 'Missing Razorpay order or payment ID' });
    }

    const userId = nodeCache.get(razorpay_order_id);
    if (!userId) {
      return res.status(404).json({ message: 'User mapping not found for this order ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Payment verified successfully',
      status: 'success',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error verifying Razorpay payment:', err);
    return res.status(500).json({ message: 'Error verifying payment', error: err.message });
  }
};


// LOGIN (create if not found)
exports.loginUser = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    const user = await User.findOne({ mobileNo, verified: true });

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
    const users = await User.find({ verified: true }).select('-__v'); // Exclude __v field
    res.json(users);
  } catch (err) {
    next(err);
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ verified: true }).select('-__v'); // Exclude __v field
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



