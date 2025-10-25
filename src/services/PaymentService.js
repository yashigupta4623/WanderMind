// Payment Integration Service with Multiple Gateways
import { SecurityUtils } from '../config/security';

class PaymentService {
  constructor() {
    this.gateways = {
      razorpay: {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
        keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
        enabled: true
      },
      stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
        enabled: false // Enable when needed
      },
      paytm: {
        merchantId: import.meta.env.VITE_PAYTM_MERCHANT_ID,
        merchantKey: import.meta.env.VITE_PAYTM_MERCHANT_KEY,
        enabled: true
      }
    };
    
    this.defaultGateway = 'razorpay';
    this.loadPaymentScripts();
  }
  
  // Load payment gateway scripts
  async loadPaymentScripts() {
    // Load Razorpay
    if (this.gateways.razorpay.enabled && !window.Razorpay) {
      await this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }
    
    // Load Stripe
    if (this.gateways.stripe.enabled && !window.Stripe) {
      await this.loadScript('https://js.stripe.com/v3/');
    }
  }
  
  // Load external script
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // Create payment order
  async createPaymentOrder(orderData) {
    const sanitizedData = {
      amount: Math.round(parseFloat(orderData.amount) * 100), // Convert to paise
      currency: SecurityUtils.sanitizeInput(orderData.currency) || 'INR',
      bookingId: SecurityUtils.sanitizeInput(orderData.bookingId),
      customerInfo: {
        name: SecurityUtils.sanitizeInput(orderData.customerInfo.name),
        email: SecurityUtils.sanitizeInput(orderData.customerInfo.email),
        phone: SecurityUtils.sanitizeInput(orderData.customerInfo.phone)
      },
      description: SecurityUtils.sanitizeInput(orderData.description),
      gateway: orderData.gateway || this.defaultGateway
    };
    
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': SecurityUtils.generateCSRFToken()
        },
        body: JSON.stringify(sanitizedData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payment order creation failed:', error);
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }
  
  // Process Razorpay payment
  async processRazorpayPayment(orderData) {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }
    
    const order = await this.createPaymentOrder({
      ...orderData,
      gateway: 'razorpay'
    });
    
    return new Promise((resolve, reject) => {
      const options = {
        key: this.gateways.razorpay.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'WanderMind',
        description: order.description,
        order_id: order.id,
        image: '/favicon.svg',
        handler: async (response) => {
          try {
            const verification = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId
            });
            resolve(verification);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: orderData.customerInfo.name,
          email: orderData.customerInfo.email,
          contact: orderData.customerInfo.phone
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
      rzp.open();
    });
  }
  
  // Process Stripe payment
  async processStripePayment(orderData) {
    if (!window.Stripe) {
      throw new Error('Stripe SDK not loaded');
    }
    
    const stripe = window.Stripe(this.gateways.stripe.publishableKey);
    
    const order = await this.createPaymentOrder({
      ...orderData,
      gateway: 'stripe'
    });
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: order.sessionId
    });
    
    if (error) {
      throw new Error(error.message);
    }
  }
  
  // Verify payment
  async verifyPayment(paymentData) {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': SecurityUtils.generateCSRFToken()
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }
  
  // Get payment status
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`/api/payments/${paymentId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Payment status check failed:', error);
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }
  
  // Refund payment
  async refundPayment(paymentId, amount, reason) {
    try {
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': SecurityUtils.generateCSRFToken()
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount) * 100),
          reason: SecurityUtils.sanitizeInput(reason)
        })
      });
      
      if (!response.ok) {
        throw new Error('Refund request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Refund failed:', error);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }
  
  // Get supported payment methods
  getSupportedMethods() {
    return Object.entries(this.gateways)
      .filter(([_, config]) => config.enabled)
      .map(([name, config]) => ({
        name,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        enabled: config.enabled
      }));
  }
  
  // Process payment with selected gateway
  async processPayment(orderData, gateway = this.defaultGateway) {
    switch (gateway) {
      case 'razorpay':
        return await this.processRazorpayPayment(orderData);
      case 'stripe':
        return await this.processStripePayment(orderData);
      case 'paytm':
        return await this.processPaytmPayment(orderData);
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
  }
  
  // Process Paytm payment (placeholder)
  async processPaytmPayment(orderData) {
    // Implement Paytm integration
    throw new Error('Paytm integration not implemented yet');
  }
}

// Create singleton instance
export const paymentService = new PaymentService();
export default paymentService;