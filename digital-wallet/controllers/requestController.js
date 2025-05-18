// controllers/requestController.js
const User = require('../models/User');
const MoneyRequest = require('../models/MoneyRequest');

exports.createRequest = async (req, res) => {
  try {
    const { toEmail, amount } = req.body;

    const fromUser = req.user;
    const toUser = await User.findOne({ email: toEmail });

    if (!toUser) return res.status(404).json({ msg: 'Recipient not found' });

    const request = new MoneyRequest({
      fromUser: fromUser._id,
      toUser: toUser._id,
      amount
    });

    await request.save();

    res.json({ msg: 'Money request sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// controllers/requestController.js
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await MoneyRequest.find({ toUser: req.user._id, status: 'pending' })
      .populate('fromUser', 'username email')
      .sort({ timestamp: -1 });

    res.json({ requests });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching requests' });
  }
};
