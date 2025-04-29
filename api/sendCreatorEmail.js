import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // ✅ Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or replace * with your domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

      
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, pass, year} = req.body;

const html = `
<!DOCTYPE html>
<html>
<head>
      <style>
      body {
        font-family: 'Trebuchet MS', 'Verdana', 'Segoe UI', 'Helvetica Neue', sans-serif;
        color: #1a1a1a;
        font-size: 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      .label {
        font-weight: 600;
        color: #555;
        padding: 8px 0;
      }
      .value {
        color: #1a1a1a;
        padding-top: 0px;
        padding-bottom: 8px;
      }
      .section-title {
        font-weight: bold;
        margin-top: 20px;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
      .separator-row td {
        padding: 0px 0;
        border-top: 1px solid #ddd;
      }
      a {
        color: #1a73e8;
        text-decoration: none;
      }
    </style>
  <meta charset="UTF-8">
  <title class="label">Your Creator Account Details</title>
</head>
<body style="font-family: 'Quicksand', sans-serif; background-color: #f4f4f4; padding: 20px; color: #333333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
    <h2 style="color: #FF0000;">Welcome to The Tribe!</h2>
    <p  class="value">Hi <strong>${name}</strong>,</p>
    <p class="value">We're excited to have you as a content creator on our platform. Below are your login credentials to get started:</p>

    <table style="margin-top: 20px; width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; font-weight: bold;">Login Email:</td>
        <td style="padding: 8px;">${email}</td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 8px; font-weight: bold;">Temporary Password:</td>
        <td style="padding: 8px;">${pass}</td>
      </tr>
    </table>

    <p  class="value" style="margin-top: 20px;">For your security, please change your password after logging in for the first time.</p>

    <p  class="value">If you have any questions or need assistance, feel free to contact our support team.</p>

    <p  class="value">Best regards,<br>
    <strong>The Tribe Team</strong></p>

    <hr style="margin-top: 40px;">
    <p style="font-size: 12px; color: #999999; text-align: center;">
      © ${year} The Tribe. All rights reserved.
    </p>
  </div>
</body>
</html>`;

  try {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    await transporter.sendMail({
      from: `"Creators" <${process.env.SMTP_USER}>`,
      to: email,
      // to: 'appsofimpact@gmail.com',
      subject: 'Creator Content Submission',
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Email failed to send. ' + error.toString(), });
  }
}
