// Payment Integration Service with Multiple Gateways
import { SecurityUtils } from '../config/security';

class PaymentService {
  constructor() {
    this.gateways = {
      razorpay: {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_OQfgILtkXzKXEJ', // Fallback for dev
        enabled: true
      },
      stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        enabled: false
      }
    };

    this.defaultGateway = 'razorpay';
    this.loadPaymentScripts();
  }

  async loadPaymentScripts() {
    if (this.gateways.razorpay.enabled && !window.Razorpay) {
      await this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async processRazorpayPayment(orderData) {
    if (!window.Razorpay) {
      await this.loadPaymentScripts();
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: this.gateways.razorpay.keyId,
        amount: Math.round(parseFloat(orderData.amount) * 100), // Amount in paise
        currency: orderData.currency || 'INR',
        name: 'WanderMind',
        description: orderData.description || 'Trip Booking',
        image: '/logo.svg', // Assuming there's a logo
        handler: function (response) {
          // In a real app, you would verify the signature on the backend
          // For this client-side demo, we assume success if we get here
          resolve({
            id: response.razorpay_payment_id,
            status: 'success',
            ...response
          });
        },
        prefill: {
          name: orderData.customerInfo?.name,
          email: orderData.customerInfo?.email,
          contact: orderData.customerInfo?.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        reject(new Error(response.error.description));
      });
      rzp.open();
    });
  }

  async processPayment(orderData, gateway = this.defaultGateway) {
    if (gateway === 'razorpay') {
      return this.processRazorpayPayment(orderData);
    }
    throw new Error(`Unsupported payment gateway: ${gateway}`);
  }
}

// Create singleton instance
export const paymentService = new PaymentService();
export default paymentService;