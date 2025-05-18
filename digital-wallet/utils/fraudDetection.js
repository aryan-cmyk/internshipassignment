const flaggedTransactions = [];

function checkFraud(transaction, user) {
  // Prevent duplicate flagging of the same transaction
  if (flaggedTransactions.some(tx => tx._id.toString() === transaction._id.toString())) {
    return; // Already flagged
  }

  // Rule 1: Multiple transfers in last 1 minute
  if (transaction.type === 'transfer') {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentTransfers = flaggedTransactions.filter(tx =>
      tx.from === user.username &&
      tx.type === 'transfer' &&
      new Date(tx.timestamp) > oneMinuteAgo
    );

    if (recentTransfers.length >= 3) { // threshold = 3 transfers in 1 minute
      flaggedTransactions.push({
        ...transaction._doc,
        flaggedReason: 'Multiple transfers in a short period',
        timestamp: new Date()
      });
      console.log(`Fraud Alert: Multiple transfers by ${user.username}`);
    }
  }

  // Rule 2: Sudden large withdrawal > 1000 USD (adjust as needed)
  if (transaction.type === 'withdraw' && transaction.amount > 1000) {
    flaggedTransactions.push({
      ...transaction._doc,
      flaggedReason: 'Large withdrawal',
      timestamp: new Date()
    });
    console.log(`Fraud Alert: Large withdrawal by ${user.username}`);
  }
}

function getFlaggedTransactions() {
  return flaggedTransactions;
}

module.exports = { checkFraud, getFlaggedTransactions };
