import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    this.initialized = false;
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  }

  init() {
    if (!this.initialized && this.publicKey) {
      emailjs.init(this.publicKey);
      this.initialized = true;
      console.log('EmailJS initialized');
    }
  }

  async sendTripInvitation({ toName, toEmail, fromName, destination, duration, tripLink, message }) {
    this.init();

    if (!this.serviceId || !this.templateId) {
      console.warn('EmailJS not configured. Using demo mode.');
      return { success: true, demo: true };
    }

    try {
      const templateParams = {
        to_name: toName,
        to_email: toEmail,
        from_name: fromName,
        trip_destination: destination,
        trip_duration: duration,
        trip_link: tripLink,
        message: message || `You've been invited to collaborate on a trip to ${destination}!`,
        reply_to: 'noreply@wandermind.com'
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Fallback: Generate mailto link if EmailJS is not configured
  generateMailtoLink({ toEmail, subject, body }) {
    const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return mailtoUrl;
  }
}

export const emailService = new EmailService();
