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
const fromSender = process.env.SMTP_FROM || `"KnowUrIP" <no-reply@knowurip.com>`;
const feedbackReceiver = "konetiajaykumar0@gmail.com";

// Cyber Dark theme template wrapper
function getCyberEmailTemplate(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            background-color: #020617;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 500px;
            margin: 0 auto;
            border: 1px solid rgba(6, 182, 212, 0.2);
            border-radius: 16px;
            background-color: #090d1f;
            padding: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #ffffff;
            margin-bottom: 20px;
            font-family: monospace;
          }
          .logo span {
            color: #06b6d4;
          }
          .title {
            font-size: 18px;
            font-weight: 600;
            color: #94a3b8;
            margin-bottom: 30px;
          }
          .otp-code {
            font-size: 38px;
            font-weight: 800;
            letter-spacing: 0.1em;
            color: #06b6d4;
            background-color: rgba(6, 182, 212, 0.1);
            border: 1px dashed rgba(6, 182, 212, 0.3);
            border-radius: 8px;
            padding: 15px 25px;
            margin: 20px 0;
            display: inline-block;
            font-family: monospace;
          }
          .btn {
            background-color: #06b6d4;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin: 25px 0;
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
          }
          .footer {
            margin-top: 40px;
            font-size: 11px;
            color: #475569;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 20px;
          }
          .meta-info {
            font-size: 12px;
            color: #64748b;
            line-height: 1.6;
            text-align: left;
            background-color: #020617;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KNOW<span>UR</span>IP</div>
          ${bodyContent}
          <div class="footer">
            KnowUrIP &copy; ${new Date().getFullYear()} // Secure Routing Analytics
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const title = "Email Verification OTP";
  const bodyContent = `
    <div class="title">Secure Account Verification</div>
    <p style="color: #cbd5e1; font-size: 14px;">Use the verification code below to authorize your session setup. This code is active for 5 minutes.</p>
    <div class="otp-code">${otp}</div>
    <p style="color: #64748b; font-size: 11px; margin-top: 20px;">If you did not initiate this handshake, please ignore this transmission.</p>
  `;
  
  try {
    await transporter.sendMail({
      from: fromSender,
      to: email,
      subject: `[KnowUrIP] Verification Code: ${otp}`,
      html: getCyberEmailTemplate(title, bodyContent),
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
  const title = "Password Reset Link";
  const bodyContent = `
    <div class="title">Credential Override Handshake</div>
    <p style="color: #cbd5e1; font-size: 14px;">A password override request was received. Click the button below to authorize a new password creation.</p>
    <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
    <p style="color: #64748b; font-size: 11px; margin-top: 20px;">This override sequence expires in 1 hour. If you did not request this, please secure your credentials immediately.</p>
  `;

  try {
    await transporter.sendMail({
      from: fromSender,
      to: email,
      subject: `[KnowUrIP] Password Reset Request`,
      html: getCyberEmailTemplate(title, bodyContent),
    });
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}

export async function sendFeedbackEmail(senderName: string, senderEmail: string, message: string): Promise<boolean> {
  const title = "User Review Transmission";
  const bodyContent = `
    <div class="title" style="color: #06b6d4;">Incoming Feedback Package</div>
    <div class="meta-info">
      <strong>Sender:</strong> ${senderName}<br/>
      <strong>Email:</strong> ${senderEmail}<br/>
      <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br/>
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 10px 0;"/>
      <strong>Transmission Payload:</strong><br/>
      <span style="color: #cbd5e1; font-style: italic;">"${message.replace(/\n/g, "<br/>")}"</span>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: fromSender,
      to: feedbackReceiver,
      subject: `[KnowUrIP Review] Incoming Feedback from ${senderName}`,
      html: getCyberEmailTemplate(title, bodyContent),
    });
    return true;
  } catch (error) {
    console.error("Failed to send feedback email:", error);
    return false;
  }
}
