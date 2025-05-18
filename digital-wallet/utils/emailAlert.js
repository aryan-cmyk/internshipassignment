function sendEmailAlert(userEmail, subject, message) {
  console.log(`Sending email to ${userEmail}: Subject: ${subject} | Message: ${message}`);
  // Replace this with actual email service (e.g., nodemailer) if needed
}

module.exports = { sendEmailAlert };
