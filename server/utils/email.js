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

// Emails a password-reset link built from the raw (unhashed) token. If SMTP
// isn't configured, the link is logged to the console instead (NFR-6 /
// dev-friendly fallback) so the flow stays testable without real email.
const sendPasswordResetEmail = async (user, rawToken) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password?token=${rawToken}`;
  const transporter = buildTransporter();

  if (!transporter) {
    console.log(`[dev] Password reset link for ${user.email}: ${resetLink}`);
    return;
  }

  try {
    const smtpUser = process.env.SMTP_USER;
    const mailOptions = {
      from: `"Bodhipath Tour & Travels" <${smtpUser}>`,
      to: user.email,
      subject: 'Reset your password / 重置您的密码',
      html: `
        <h2>Reset your password</h2>
        <p>Hi ${user.name || ''},</p>
        <p>We received a request to reset your password. This link expires in 30 minutes.</p>
        <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#7b2939;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
        <p>Or copy this link: ${resetLink}</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <hr />
        <h2>重置您的密码</h2>
        <p>您好 ${user.name || ''}，</p>
        <p>我们收到了重置您密码的请求。此链接将在 30 分钟后失效。</p>
        <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#7b2939;color:#fff;text-decoration:none;border-radius:6px;">重置密码</a></p>
        <p>如果这不是您本人的操作，请忽略此邮件。</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send password reset email:', error.message);
    // Fall back to a console link so a flaky SMTP provider never blocks the flow locally
    console.log(`[dev] Password reset link for ${user.email}: ${resetLink}`);
  }
};

module.exports = {
  sendInquiryEmail,
  sendPasswordResetEmail,
};
