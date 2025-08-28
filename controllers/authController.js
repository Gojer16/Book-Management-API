const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
require('dotenv').config({ path: './.env' }); 
dotenv.config() 

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m' 
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};


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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    await user.save();
  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ success: true, accessToken }); 
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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push(refreshToken);
    await user.save();


      res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, accessToken }); 
  } catch (err) {
    next(err);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ success: false, message: 'Invalid refresh token' });

      const user = await User.findById(decoded.id);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ success: false, message: 'Refresh token not found' });
      }

      const newAccessToken = generateAccessToken(user._id);

      res.status(200).json({ success: true, accessToken: newAccessToken });
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.id) {
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
          await user.save();
        }
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is already set by authMiddleware
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /me:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

