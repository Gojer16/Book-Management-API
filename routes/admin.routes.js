const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
        message: 'Access denied: Admins only' 
    });
  }
  next();
};

router.put('/role/:userId', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'reader', 'user'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role' 
    });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('email role');

    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
