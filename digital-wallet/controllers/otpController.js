const { generateOTP, verifyOTP, clearOTP } = require('../utils/otp');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

exports.sendOTP = async (req, res) => {
  const user = await User.findById(req.user.id);
  const otp = generateOTP(user.id);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Your OTP Code',
    text: `Your OTP for wallet operation is ${otp}`
  };

  await transporter.sendMail(mailOptions);
  res.json({ msg: 'OTP sent to your email.' });
};

exports.verifyOTP = (req, res) => {
  const { otp } = req.body;
  const valid = verifyOTP(req.user.id, otp);
  if (!valid) return res.status(400).json({ msg: 'Invalid or expired OTP' });

  clearOTP(req.user.id);
  res.json({ msg: 'OTP verified successfully' });
};

