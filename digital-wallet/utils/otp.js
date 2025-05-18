const crypto = require('crypto');

let otpStore = {};

exports.generateOTP = (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[userId] = { otp, expiresAt };
  return otp;
};

exports.verifyOTP = (userId, enteredOtp) => {
  const record = otpStore[userId];
  if (!record || Date.now() > record.expiresAt) return false;
  return record.otp === enteredOtp;
};

exports.clearOTP = (userId) => {
  delete otpStore[userId];
};
