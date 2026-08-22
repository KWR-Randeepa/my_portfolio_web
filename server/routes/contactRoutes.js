import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.MAIL_USER}>`,
      replyTo: email,
      to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
      subject: `Portfolio Transmission from ${name}`,
      text: message,
      html: `
        <div style="font-family: monospace; background: #050505; color: #e2e8f0; padding: 20px; border-radius: 8px;">
          <h3 style="color: #64748b;">[PORTFOLIO TRANSMISSION DETECTED]</h3>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
          <hr style="border: 1px solid #1e293b; margin: 15px 0;" />
          <p style="white-space: pre-wrap; color: #f8fafc;">${message}</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Transmission dispatched successfully.' });
  } catch (error) {
    console.error('Nodemailer Transmission Error:', error);
    res.status(500).json({ error: error.message || 'Failed to dispatch transmission.' });
  }
});

export default router;