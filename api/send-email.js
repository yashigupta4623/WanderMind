// Serverless function for sending emails
// This can be deployed to Vercel, Netlify, or any serverless platform

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, toName, fromName, subject, html } = req.body;

    // Validate required fields
    if (!to || !toName || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"WanderMind" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: process.env.EMAIL_USER
    });

    console.log('Email sent:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
