const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who is requesting
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // whom they're requesting from
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
