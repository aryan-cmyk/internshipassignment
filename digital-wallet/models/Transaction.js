const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true
  },
  amount: { type: Number, required: true },
  from: { type: String, default: null }, // sender's username
  to: { type: String, default: null },   // receiver's username
  currency: { type: String, default: 'USD' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
