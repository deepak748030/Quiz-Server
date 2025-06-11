// controllers/userController.js
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const axios = require('axios');
const nodecache = require('node-cache');
const nodeCache = new nodecache({ stdTTL: 600 }); // 600 seconds = 10 minutes



// prod
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL;

exports.registerUser = async (req, res) => {
  try {
    const { name, guardianOrParent, mobileNo, aadhaarNo, panCardNo, dob, education, address } = req.body;
    const verified = req.body.verified || false;

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
      const orderData = {
        order_amount: 200.00,
        order_currency: "INR",
        customer_details: {
          customer_id: newUser._id.toString(),
          customer_name: newUser.name,
          customer_phone: newUser.mobileNo
        }
      };

      let response;
      try {
        response = await axios.post(
          `${CASHFREE_BASE_URL}/orders`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-version": "2023-08-01",
              "x-client-id": CASHFREE_APP_ID,
              "x-client-secret": CASHFREE_SECRET_KEY
            }
          }
        );
      } catch (err) {
        return res.status(500).json({
          message: 'Payment link generation failed, user not registered',
          error: err.response?.data || err.message
        });
      }

      // const orderId = response.data.order_id;
      // console.log(response.data)
      // const paymentLink = `${CASHFREE_BASE_URL}/session/${response.data.payment_session_id}`;
      nodeCache.set(response.data.order_id, newUser._id.toString());
      console.log(response.data.order_id)
      return res.status(201).json({
        message: 'newUser registered',
        user: { id: newUser._id, verified: newUser.verified, data: response.data }
      });
    } else {
      return res.status(201).json({ message: 'User registered', user: newUser });
    }

  } catch (err) {
    console.error('Registration failed:', err);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log('Verifying orderId:', orderId);

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    // 1. Check payment status
    const paymentResponse = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${orderId}/payments`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY
        }
      }
    );

    const payments = paymentResponse.data;
    console.log(paymentResponse.data)
    if (!payments) {
      return res.status(404).json({ message: 'No payments found for this order' });
    }

    // Debugging all payment statuses
    console.log('Payments received:', payments.map(p => ({
      id: p.cf_payment_id,
      status: p.payment_status
    })));

    // 2. Find the successful payment
    const successfulPayment = payments.find(
      payment => payment.payment_status?.toUpperCase() === 'SUCCESS'
    );
    console.log("----", successfulPayment)
    if (!successfulPayment) {
      return res.status(400).json({ message: 'Payment not successful yet' });
    }

    // 3. Get userId from cache
    const userId = nodeCache.get(orderId);
    if (!userId) {
      return res.status(404).json({ message: 'User mapping not found in cache (expired or missing)' });
    }

    // 4. Update user as verified
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Payment verified successfully.',
      status: "success",
      payments: payments
    });

  } catch (err) {
    console.error('Error verifying payment:', err.response?.data || err.message);
    return res.status(500).json({
      message: 'Error verifying payment',
      error: err.response?.data || err.message
    });
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



