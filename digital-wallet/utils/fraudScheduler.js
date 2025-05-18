const cron = require('node-cron');
const { getFlaggedTransactions } = require('./fraudDetection');

function startFraudScan() {
  // Run daily at midnight
  cron.schedule('0 0 * * *', () => {
    const flagged = getFlaggedTransactions();
    console.log('Daily Fraud Scan Report:', flagged);
    // You can add email alerts or save to DB here
  });
}

module.exports = { startFraudScan };
