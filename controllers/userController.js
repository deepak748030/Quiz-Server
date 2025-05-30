// controllers/userController.js
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

exports.loginAndFetch = async (req, res, next) => {
  try {
    const { rollNumber, username, school } = req.body;
    if (!username || !school) {
      let user = await User.findOne({ rollNumber });
      if (!user) {
        return res.status(400).json({ message: 'user not available with this roll no ' })
      }
      res.status(200).json({ message: 'user logged in successfully', data: user });

    } else {
      if (!rollNumber || !username || !school) return res.status(400).json({ message: 'rollNumber, username & school required' });
      let user = await User.findOne({ rollNumber });
      if (user) {
        return res.status(400).json({ message: 'user already exists with this roll no ' })
      }
      const data = await User.create({ rollNumber, username, school });
      res.status(201).json({ message: 'user created successfully', data: data });

    }
  } catch (err) { next(err); }
};
// async function createDefaultUser() {
//   const defaultData = {
//     rollNumber: '0000',
//     username: 'Default User',
//     school: 'Default School'
//   };
//   return await User.create(defaultData);
// }
// createDefaultUser()


// const data = async () => {
//   try {
//     const data = { rollNumber: "0000", username: "Default User", school: "Default School" }
//     const { rollNumber, username, school } = data;
//     if (!rollNumber || !username || !school) return res.status(400).json({ message: 'rollNumber, username & school required' });
//     let user = await User.findOne({ rollNumber });
//     if (!user) user = await User.create({ rollNumber, username, school });
//     console.log(user)
//     const now = new Date();
//     const active = await Quiz.find({
//       assignedUsers: { $in: [user._id] },
//       startTime: { $lte: now.toISOString() },
//       endTime: { $gte: now.toISOString() }
//     }).select('title startTime endTime');
//     console.log(active)
//     const pastResults = await Result.find({ user: user._id }).populate('quiz', 'title').select('score submittedAt');
//     console.log(pastResults)
//     // res.json({ user, activeQuizzes: active, pastResults });
//   } catch (err) {
//     console.log(err)
//   }
// };
// setTimeout(() => {
//   data();
// }, 3000);


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

    // Get current IST time
    const nowUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + istOffset);

    const activeQuizzes = await Quiz.find({
      assignedUsers: { $in: [userId] },
      startTime: { $lte: nowIST },
      endTime: { $gte: nowIST }
    }).select('title startTime endTime');

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