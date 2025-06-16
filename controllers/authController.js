const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
require('dotenv').config({ path: './.env' }); 
dotenv.config() 

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => { 
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.create({ email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ success: true, token }); 
  } catch (err) {
    next(err);
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => { 
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 400;
      return next(error);
    }

    const isMatch = await user.comparePassword(password); 
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 400;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ success: true, token }); 
  } catch (err) {
    next(err);
  }
};