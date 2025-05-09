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

  const { name, email, title, stage, type, description, category, audience, links } = req.body;

  // Create a transporter using Gmail
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USER, // your Gmail
//       pass: process.env.EMAIL_PASS, // App Password (not Gmail password)
//     },
//   });

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
  </head>
  <body>
  <h2>Content Submission</h2>
    <table>
        <tr>
        <td class="label">Creator details</td>
        <td class="label">Name</td>
      </tr>
      <tr>
        <td class="label"></td>
        <td class="value">${name}</td>
      </tr>
      <tr>
        <td class="label"></td>
        <td class="label">Email</td>
      </tr>
         <tr>
        <td class="label"></td>
        <td class="value">${email}</td>
      </tr>
      <tr class="separator-row"><td colspan="2"></td></tr>
        <tr>
        <td class="label">Content Stage & Type</td>
        <td class="label">Stage</td>
      </tr>
      <tr>
        <td class="label"></td>
        <td class="value">${stage}</td>
      </tr>
      <tr>
      <tr>
        <td class="label"></td>
        <td class="label">Type</td>
      </tr>
      <td class="label"></td>
      <td class="value">${type}</td>
      </tr>
      <tr class="separator-row"><td colspan="2"></td></tr>
      <tr>
        <td class="label">Content Details</td>
        <td class="label">Title</td>
      </tr>
      <tr>
        <td class="label"></td>
        <td class="value">${title}</td>
      </tr>
      <tr>
        <td class="label"></td>
        <td class="label">Description/Synopsis</td>
      </tr>
         <tr>
        <td class="label"></td>
        <td class="value">${description}</td>
      </tr>
      <tr>
        <td class="label">Category</td>
        <td class="value">${category}</td>
      </tr>
      <tr>
        <td class="label">Target Audience</td>
        <td class="value">${audience}</td>
      </tr>
      <tr>
          <td class="label">Content Link(s)</td>
          <td class="value">
            ${links.map(link => `<a href="${link}">${link}</a>`).join('<br/>')}
          </td>
        </tr>
     <tr>
        <td colspan="2" style="text-align: right; padding: 20px 0;">
          <img
          src="https://thetribeug.ams3.cdn.digitaloceanspaces.com/logoRed.png"
          alt="The Tribe Africa"
          width="200"
          style="display: block; margin: 0;"
          >
          </td>
          </tr>
    </table>
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
      to: 'appsofimpact@gmail.com',
      subject: 'Content Creator Submission',
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Email failed to send. ' + error.toString(), });
  }
}
