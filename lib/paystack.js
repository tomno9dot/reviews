import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET}`,
    'Content-Type': 'application/json'
  }
});

const paystack = {
  
  // Initialize payment (redirect to Paystack checkout)
  initializePayment: async ({ 
    email, 
    amount,      // Amount in KOBO (multiply by 100)
    currency = 'NGN',
    metadata = {},
    callback_url,
    plan         // For subscriptions
  }) => {
    const response = await paystackAPI.post(
      '/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo
        currency,
        metadata,
        callback_url,
        plan           // Paystack plan code
      }
    );
    return response.data;
  },

  // Verify payment after redirect
  verifyPayment: async (reference) => {
    const response = await paystackAPI.get(
      `/transaction/verify/${reference}`
    );
    return response.data;
  },

  // Create customer on Paystack
  createCustomer: async ({ email, name, phone }) => {
    const response = await paystackAPI.post('/customer', {
      email,
      first_name: name.split(' ')[0],
      last_name: name.split(' ')[1] || '',
      phone
    });
    return response.data;
  },

  // Create subscription plan (do this ONCE in Paystack dashboard)
  // Starter: ₦5,000/month or $10/month
  // Pro: ₦10,000/month or $20/month

  // Subscribe customer to plan
  createSubscription: async ({ 
    customerCode, 
    planCode,
    authorization  // Card authorization code
  }) => {
    const response = await paystackAPI.post('/subscription', {
      customer: customerCode,
      plan: planCode,
      authorization
    });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async ({ 
    subscriptionCode, 
    emailToken 
  }) => {
    const response = await paystackAPI.post(
      '/subscription/disable',
      {
        code: subscriptionCode,
        token: emailToken
      }
    );
    return response.data;
  },

  // Get subscription details
  getSubscription: async (subscriptionCode) => {
    const response = await paystackAPI.get(
      `/subscription/${subscriptionCode}`
    );
    return response.data;
  }
};

export default paystack;