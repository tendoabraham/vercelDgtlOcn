import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS, // App Password (not Gmail password)
    },
  });

  try {
    await transporter.sendMail({
      from: `"Creators" <${process.env.EMAIL_USER}>`,
      to: 'tendoabraham@email.com',
      subject: 'Creator Content Submission',
      html: `
        <h2>New Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Email failed to send.' });
  }
}
