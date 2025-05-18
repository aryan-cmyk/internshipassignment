const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { getFlaggedTransactions } = require('../utils/fraudDetection');

exports.viewFlaggedTransactions = (req, res) => {
  const flagged = getFlaggedTransactions();
  res.json(flagged);
};

exports.aggregateUserBalances = async (req, res) => {
  try {
    const users = await User.find({ isSoftDeleted: false });
    const aggregated = users.map(user => ({
      username: user.username,
      totalBalance: user.wallets.reduce((sum, w) => sum + w.balance, 0)
    }));

    res.json(aggregated);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.topUsersByBalance = async (req, res) => {
  try {
    const users = await User.find({ isSoftDeleted: false });
    const ranked = users
      .map(user => ({
        username: user.username,
        totalBalance: user.wallets.reduce((sum, w) => sum + w.balance, 0)
      }))
      .sort((a, b) => b.totalBalance - a.totalBalance)
      .slice(0, 10);

    res.json(ranked);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.topUsersByTransactionVolume = async (req, res) => {
  try {
    const aggregation = await Transaction.aggregate([
      { $match: { isSoftDeleted: false } },
      { $group: { _id: '$from', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    res.json(aggregation);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
