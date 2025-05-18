const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  currency: { type: String, default: 'USD' },
  balance: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
  isAdmin: { type: Boolean, default: false },
  isSoftDeleted: { type: Boolean, default: false },
  wallets: [WalletSchema],
  refreshToken: { type: String, default: null },  // Add this line
});

module.exports = mongoose.model('User', UserSchema);
