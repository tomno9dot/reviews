// lib/paystack.js

import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET) {
  console.warn('PAYSTACK_SECRET_KEY is not set in .env.local');
}

const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: 'Bearer ' + PAYSTACK_SECRET,
    'Content-Type': 'application/json',
  },
});

const paystack = {

  // ✅ Initialize payment
  initializePayment: async ({
    email,
    amount,
    currency,
    metadata,
    callback_url,
  }) => {
    try {
      // ✅ Always use NGN - remove currency param
      // Paystack defaults to NGN for Nigerian accounts
      const payload = {
        email,
        amount: amount * 100, // Convert to kobo
        metadata,
        callback_url,
      };

      console.log('Paystack payload:', JSON.stringify(payload, null, 2));

      const response = await paystackAPI.post(
        '/transaction/initialize',
        payload
      );

      return response.data;

    } catch (error) {
      // ✅ Better error logging
      const errorData = error.response?.data;
      console.error('Paystack error:', {
        status: error.response?.status,
        message: errorData?.message,
        code: errorData?.code,
      });
      throw error;
    }
  },

  // ✅ Verify payment
  verifyPayment: async (reference) => {
    try {
      const response = await paystackAPI.get(
        '/transaction/verify/' + reference
      );
      return response.data;
    } catch (error) {
      console.error('Verify error:', error.response?.data);
      throw error;
    }
  },

  // ✅ Create customer
  createCustomer: async ({ email, name, phone }) => {
    try {
      const nameParts = name.split(' ');
      const response = await paystackAPI.post('/customer', {
        email,
        first_name: nameParts[0] || '',
        last_name: nameParts[1] || '',
        phone: phone || '',
      });
      return response.data;
    } catch (error) {
      console.error('Create customer error:', error.response?.data);
      throw error;
    }
  },

  // ✅ Get subscription
  getSubscription: async (subscriptionCode) => {
    try {
      const response = await paystackAPI.get(
        '/subscription/' + subscriptionCode
      );
      return response.data;
    } catch (error) {
      console.error('Get subscription error:', error.response?.data);
      throw error;
    }
  },

  // ✅ Cancel subscription
  cancelSubscription: async ({ subscriptionCode, emailToken }) => {
    try {
      const response = await paystackAPI.post(
        '/subscription/disable',
        {
          code: subscriptionCode,
          token: emailToken,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Cancel subscription error:', error.response?.data);
      throw error;
    }
  },
};

export default paystack;