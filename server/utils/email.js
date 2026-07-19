const nodemailer = require('nodemailer');

// Shared transporter builder — returns null if SMTP is not configured so
// callers can skip silently instead of throwing (NFR-6).
const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT || 587;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
};

const sendInquiryEmail = async (inquiry) => {
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const transporter = buildTransporter();

  if (!transporter || !notifyEmail) {
    // Skip silently if email settings are incomplete
    return;
  }

  try {
    const user = process.env.SMTP_USER;
    const mailOptions = {
      from: `"Buddhist Pilgrimage Tours" <${user}>`,
      to: notifyEmail,
      subject: `New Tour Booking Inquiry from ${inquiry.name}`,
      html: `
        <h2>New Booking Inquiry Details</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Contact Email:</strong> ${inquiry.email || 'N/A'}</p>
        <p><strong>Contact Phone:</strong> ${inquiry.phone || 'N/A'}</p>
        <p><strong>WeChat ID:</strong> ${inquiry.wechatId || 'N/A'}</p>
        <p><strong>Country:</strong> ${inquiry.country || 'N/A'}</p>
        <hr />
        <p><strong>Tour of Interest:</strong> ${inquiry.tourTitle}</p>
        <p><strong>Number of Travellers:</strong> ${inquiry.groupSize}</p>
        <p><strong>Preferred Travel Month/Date:</strong> ${inquiry.travelDate || 'N/A'}</p>
        <p><strong>Message / Questions:</strong></p>
        <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; padding: 10px;">
          ${inquiry.message ? inquiry.message.replace(/\n/g, '<br>') : 'None'}
        </blockquote>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Inquiry notification email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send inquiry email notification:', error.message);
  }
};

module.exports = {
  sendInquiryEmail,
};
