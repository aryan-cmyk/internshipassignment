const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { checkFraud } = require('../utils/fraudDetection');

exports.deposit = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Invalid amount' });
    }
    const currencyCode = currency || 'USD';

    const wallet = req.user.wallets.find(w => w.currency === currencyCode);
    if (!wallet) {
      // If wallet for currency doesn't exist, create it
      req.user.wallets.push({ currency: currencyCode, balance: 0 });
    }
    const userWallet = req.user.wallets.find(w => w.currency === currencyCode);
    userWallet.balance += amount;

    await req.user.save();

    const tx = await Transaction.create({
      type: 'deposit',
      to: req.user.username,
      amount,
      currency: currencyCode
    });

    res.json({ msg: 'Deposit successful', tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Invalid amount' });
    }
    const currencyCode = currency || 'USD';

    const wallet = req.user.wallets.find(w => w.currency === currencyCode);
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    wallet.balance -= amount;
    await req.user.save();

    const tx = await Transaction.create({
      type: 'withdraw',
      from: req.user.username,
      amount,
      currency: currencyCode
    });

    checkFraud(tx, req.user);

    res.json({ msg: 'Withdraw successful', tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { toUsername, amount, currency } = req.body;
    if (!toUsername || !amount || amount <= 0) {
      return res.status(400).json({ msg: 'Invalid transfer data' });
    }
    const currencyCode = currency || 'USD';

    if (toUsername === req.user.username) {
      return res.status(400).json({ msg: 'Cannot transfer to yourself' });
    }

    const recipient = await User.findOne({ username: toUsername, isSoftDeleted: false });
    if (!recipient) {
      return res.status(400).json({ msg: 'Recipient not found' });
    }

    const senderWallet = req.user.wallets.find(w => w.currency === currencyCode);
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    let recipientWallet = recipient.wallets.find(w => w.currency === currencyCode);
    if (!recipientWallet) {
      // Create recipient wallet if missing
      recipient.wallets.push({ currency: currencyCode, balance: 0 });
      recipientWallet = recipient.wallets.find(w => w.currency === currencyCode);
    }

    // Perform atomic balance updates
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await req.user.save();
    await recipient.save();

    const tx = await Transaction.create({
      type: 'transfer',
      from: req.user.username,
      to: recipient.username,
      amount,
      currency: currencyCode
    });

    checkFraud(tx, req.user);

    res.json({ msg: 'Transfer successful', tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.history = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.user.username }, { to: req.user.username }]
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const balances = req.user.wallets.map(w => ({
      currency: w.currency,
      balance: w.balance
    }));

    res.json({ balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
