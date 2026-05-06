const nodemailer = require('nodemailer');

/**
 * Creates a reusable nodemailer transporter.
 * Uses Gmail SMTP with App Password (recommended over plain password).
 *
 * Required .env vars:
 *   EMAIL_USER  — your Gmail address (e.g. yourapp@gmail.com)
 *   EMAIL_PASS  — Gmail App Password (16-char, generated in Google Account > Security > App Passwords)
 */
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

/**
 * Sends an OTP verification email.
 * @param {string} to      - Recipient email
 * @param {string} otp     - 6-digit OTP
 * @param {string} name    - Recipient's name (for personalisation)
 */
const sendOtpEmail = async (to, otp, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Grow More Lanka" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Grow More Lanka Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#04020e;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#04020e;padding:40px 20px;">
            <tr><td align="center">
              <table width="520" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(0,100,200,0.3),rgba(80,0,200,0.2));padding:32px 40px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.07);">
                    <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:0.1em;">GROW MORE</div>
                    <div style="font-size:9px;font-weight:700;color:#00b4ff;letter-spacing:0.3em;text-transform:uppercase;margin-top:2px;">LANKA</div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <p style="color:rgba(255,255,255,0.7);font-size:15px;margin:0 0 8px;">Hi <strong style="color:#fff;">${name}</strong>,</p>
                    <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 28px;line-height:1.6;">
                      Use the verification code below to complete your Grow More Lanka account registration.
                      This code expires in <strong style="color:#fff;">10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="text-align:center;margin:0 0 28px;">
                      <div style="display:inline-block;background:rgba(0,180,255,0.08);border:2px solid rgba(0,180,255,0.35);border-radius:14px;padding:20px 48px;">
                        <div style="font-size:42px;font-weight:900;letter-spacing:12px;color:#00b4ff;font-family:monospace;">${otp}</div>
                      </div>
                    </div>

                    <p style="color:rgba(255,255,255,0.35);font-size:12px;text-align:center;margin:0;">
                      If you didn't request this, please ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;">
                      © ${new Date().getFullYear()} Grow More Lanka Investment Consultancy
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
