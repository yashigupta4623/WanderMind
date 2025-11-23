class EmailService {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api/send-email';
    console.log('Email service initialized');
  }

  async sendTripInvitation({ toName, toEmail, fromName, destination, duration, tripLink, message }) {
    try {
      const emailHtml = this.generateEmailHTML({
        toName,
        fromName,
        destination,
        duration,
        tripLink,
        message: message || `You've been invited to collaborate on a trip to ${destination}!`
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail,
          toName: toName,
          fromName: fromName,
          subject: `✈️ You're invited to plan a trip to ${destination}!`,
          html: emailHtml
        })
      });

      const result = await response.json();

      if (result.success) {
        return { 
          success: true,
          message: `📧 Invitation email sent to ${toEmail}!`
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Fallback: copy link
      try {
        await navigator.clipboard.writeText(tripLink);
      } catch (e) {
        console.error('Clipboard error:', e);
      }
      
      return { 
        success: true, 
        demo: true,
        message: `⚠️ Email server not running. Link copied! Share with ${toName}`
      };
    }
  }

  generateEmailHTML({ toName, fromName, destination, duration, tripLink, message }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .trip-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .trip-details h2 {
            margin-top: 0;
            color: #667eea;
          }
          .button { 
            display: inline-block; 
            padding: 15px 40px; 
            background: #667eea; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #666; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✈️ Trip Invitation</h1>
            <p>You're invited to collaborate!</p>
          </div>
          <div class="content">
            <p>Hi <strong>${toName}</strong>,</p>
            <p><strong>${fromName}</strong> has invited you to collaborate on an exciting trip!</p>
            
            <div class="trip-details">
              <h2>📍 ${destination}</h2>
              <p><strong>Duration:</strong> ${duration}</p>
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            
            <p>Click the button below to view the trip details and join the planning:</p>
            
            <center>
              <a href="${tripLink}" class="button">View Trip & Join Planning</a>
            </center>
            
            <p>You'll be able to:</p>
            <ul>
              <li>View the complete itinerary</li>
              <li>Vote on hotels and activities</li>
              <li>Add your preferences</li>
              <li>Collaborate with the group</li>
            </ul>
            
            <p>Happy travels!<br><strong>The WanderMind Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent from WanderMind - AI-Powered Travel Planning</p>
            <p>If you have any questions, please contact the trip organizer.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
