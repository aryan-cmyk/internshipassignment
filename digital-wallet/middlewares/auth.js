const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.isSoftDeleted) return res.status(403).json({ msg: 'User inactive' });
    req.user = user;
    next();
  } catch {
    res.status(400).json({ msg: 'Invalid token' });
  }
};
