require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/send', async (req, res) => {
  const { name, email, phone, item, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const mailOptions = {
    from: `"Seaton Logistics Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New Shipping Enquiry from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #E8392A; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">New Shipping Enquiry</h2>
        </div>
        <div style="background: #f9f9f9; padding: 32px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 160px;">Name</td>
              <td style="padding: 10px 0; color: #111;">${name}</td>
            </tr>
            <tr style="border-top: 1px solid #e8e8e8;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #E8392A;">${email}</a></td>
            </tr>
            <tr style="border-top: 1px solid #e8e8e8;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone / WhatsApp</td>
              <td style="padding: 10px 0; color: #111;">${phone || '—'}</td>
            </tr>
            <tr style="border-top: 1px solid #e8e8e8;">
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Shipping Category</td>
              <td style="padding: 10px 0; color: #111;">${item || '—'}</td>
            </tr>
            <tr style="border-top: 1px solid #e8e8e8;">
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${message || '—'}</td>
            </tr>
          </table>
          <p style="margin-top: 28px; font-size: 13px; color: #999;">
            Sent from the Seaton Logistics website contact form.<br/>
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Seaton Logistics server running at http://localhost:${PORT}`);
});
