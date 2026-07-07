import nodemailer from "nodemailer";

const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

const transporter = nodemailer.createTransport(smtpConfig);
const fromSender = process.env.SMTP_FROM || `"Know Your IP" <no-reply@knowurip.com>`;
const feedbackReceiver = "konetiajaykumar0@gmail.com";

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email – Know Your IP</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #f0f4f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
      color: #1e293b;
    }
    .wrapper { max-width: 600px; margin: 40px auto; padding: 0 16px; }
    .card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      padding: 36px 40px;
      text-align: center;
    }
    .logo {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 0.06em;
      color: #ffffff;
      font-family: 'Courier New', monospace;
    }
    .logo span { color: #22d3ee; }
    .logo-sub {
      font-size: 12px;
      color: #94a3b8;
      letter-spacing: 0.1em;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .text { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 12px; }
    .otp-box {
      background: linear-gradient(135deg, #ecfeff 0%, #e0f2fe 100%);
      border: 2px dashed #22d3ee;
      border-radius: 12px;
      text-align: center;
      padding: 28px;
      margin: 28px 0;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #0891b2;
      margin-bottom: 10px;
    }
    .otp-code {
      font-size: 44px;
      font-weight: 900;
      letter-spacing: 0.18em;
      color: #0f172a;
      font-family: 'Courier New', monospace;
    }
    .otp-valid {
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
    }
    .features {
      background: #f8fafc;
      border-radius: 10px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .features-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .feature-item {
      font-size: 14px;
      color: #475569;
      padding: 5px 0;
      line-height: 1.5;
    }
    .warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
      padding: 12px 16px;
      font-size: 13px;
      color: #92400e;
      margin: 20px 0;
    }
    .ignore {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 20px;
      line-height: 1.6;
    }
    .footer {
      background: #f1f5f9;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text { font-size: 12px; color: #94a3b8; line-height: 1.6; }
    .footer-brand { font-weight: 700; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <div class="logo">KNOW<span>UR</span>IP</div>
        <div class="logo-sub">IP Analytics &amp; Security Platform</div>
      </div>

      <!-- Body -->
      <div class="body">
        <p class="greeting">Hello,</p>
        <p class="text"><strong>Welcome to Know Your IP! 🎉</strong></p>
        <p class="text">Thank you for signing up. We're excited to have you on board.</p>
        <p class="text">To complete your registration and verify your email address, please use the One-Time Password (OTP) below:</p>

        <!-- OTP Box -->
        <div class="otp-box">
          <div class="otp-label">Your Verification Code</div>
          <div class="otp-code">${otp}</div>
          <div class="otp-valid">⏱ This code is valid for <strong>10 minutes</strong></div>
        </div>

        <div class="warning">
          🔒 Please do not share this code with anyone. Know Your IP will never ask for your OTP via phone or chat.
        </div>

        <p class="text">Once your email is verified, you'll be able to:</p>
        <div class="features">
          <div class="feature-item">🌍 Search and analyze public IP addresses</div>
          <div class="feature-item">📍 View geolocation, ISP, and network details</div>
          <div class="feature-item">🔒 Check IP reputation and security information</div>
          <div class="feature-item">🛡️ Identify potentially malicious or suspicious IPs</div>
          <div class="feature-item">⚡ Access fast and reliable IP lookup tools</div>
        </div>

        <p class="ignore">If you did not create a Know Your IP account, you can safely ignore this email. No action is required.</p>
        <p class="ignore" style="margin-top:24px;">Thank you for choosing Know Your IP.<br/><br/>Best regards,<br/><strong>The Know Your IP Team</strong></p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          <span class="footer-brand">Know Your IP</span> · IP Analytics &amp; Security Platform<br/>
          This is an automated message. Please do not reply to this email.<br/>
          © ${new Date().getFullYear()} Know Your IP. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: fromSender,
      to: email,
      subject: `Your Know Your IP Verification Code: ${otp}`,
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Reset Your Password – Know Your IP</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; }
    .wrapper { max-width: 600px; margin: 40px auto; padding: 0 16px; }
    .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 36px 40px; text-align: center; }
    .logo { font-size: 26px; font-weight: 900; color: #fff; font-family: 'Courier New', monospace; letter-spacing: 0.06em; }
    .logo span { color: #22d3ee; }
    .body { padding: 40px; }
    .text { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 12px; }
    .btn-wrap { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background: #0891b2; color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 700; }
    .warning { background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px; font-size: 13px; color: #92400e; margin: 20px 0; }
    .footer { background: #f1f5f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper"><div class="card">
    <div class="header"><div class="logo">KNOW<span>UR</span>IP</div></div>
    <div class="body">
      <p class="text" style="font-size:20px;font-weight:700;color:#0f172a;margin-bottom:16px;">Password Reset Request</p>
      <p class="text">We received a request to reset the password for your Know Your IP account. Click the button below to set a new password:</p>
      <div class="btn-wrap"><a href="${resetLink}" class="btn">Reset My Password</a></div>
      <div class="warning">⚠️ This link is valid for <strong>1 hour</strong>. If you did not request a password reset, please ignore this email — your account is safe.</div>
      <p class="text" style="margin-top:20px;">Best regards,<br/><strong>The Know Your IP Team</strong></p>
    </div>
    <div class="footer"><p class="footer-text">© ${new Date().getFullYear()} Know Your IP. All rights reserved.</p></div>
  </div></div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: fromSender,
      to: email,
      subject: "Reset Your Know Your IP Password",
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}

export async function sendFeedbackEmail(senderName: string, senderEmail: string, reason: string, message: string): Promise<boolean> {
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>New Feedback</title>
<style>
  body { background:#f0f4f8; font-family: -apple-system, sans-serif; }
  .card { max-width:600px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
  .header { background:linear-gradient(135deg,#0f172a,#1e3a5f); padding:28px 36px; }
  .logo { font-size:22px; font-weight:900; color:#fff; font-family:monospace; letter-spacing:0.06em; }
  .logo span { color:#22d3ee; }
  .body { padding:32px 36px; }
  .field { margin-bottom:16px; }
  .label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#94a3b8; margin-bottom:4px; }
  .value { font-size:15px; color:#0f172a; }
  .message-box { background:#f8fafc; border-radius:8px; padding:16px; font-size:14px; color:#334155; line-height:1.7; white-space:pre-wrap; }
</style>
</head>
<body><div class="card">
  <div class="header"><div class="logo">KNOW<span>UR</span>IP</div></div>
  <div class="body">
    <p style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:20px;">📬 New User Feedback</p>
    <div class="field"><div class="label">From</div><div class="value">${senderName}</div></div>
    <div class="field"><div class="label">Email</div><div class="value">${senderEmail}</div></div>
    <div class="field"><div class="label">Reason</div><div class="value">${reason}</div></div>
    <div class="field"><div class="label">Received</div><div class="value">${new Date().toLocaleString()}</div></div>
    <div class="field"><div class="label">Message</div><div class="message-box">${message.replace(/\n/g, "<br/>")}</div></div>
  </div>
</div></body></html>`;

  try {
    await transporter.sendMail({
      from: fromSender,
      to: feedbackReceiver,
      subject: `[KnowUrIP Feedback] [${reason}] Message from ${senderName}`,
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send feedback email:", error);
    return false;
  }
}
