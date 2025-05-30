require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('./config/db');

const app = express();
app.use(morgan('dev'));
app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));  // admin & broker auth
app.use('/api/user', require('./routes/userRoutes'));  // user login + fetch
app.use('/api/quizzes', require('./routes/quizRoutes')); // quiz endpoints
app.use('/api/admin', require('./routes/adminRoutes'));  // admin CRUD
app.use('/api/broker', require('./routes/brokerRoutes')); // broker tasks

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
