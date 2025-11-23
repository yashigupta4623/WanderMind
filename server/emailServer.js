import express from 'express';
import cors from 'cors';
import pkg from 'nodemailer';
const { createTransport } = pkg;
import { config } from 'dotenv';

// Load environment variables from parent directory
config({ path: '../.env' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
  } else {
    console.log('✅ Email server ready to send emails');
  }
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, toName, fromName, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const mailOptions = {
      from: `"WanderMind" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent to:', to);
    console.log('   Message ID:', info.messageId);

    res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 Email Server Started');
  console.log(`📧 Server running on: http://localhost:${PORT}`);
  console.log(`📧 Email account: ${process.env.EMAIL_USER || 'Not configured'}`);
  console.log('\n');
});
