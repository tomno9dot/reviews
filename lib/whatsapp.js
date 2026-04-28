import axios from 'axios';

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_BASE_URL = 'https://api.ng.termii.com/api';

const termii = axios.create({
  baseURL: TERMII_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const sendWhatsAppMessage = async ({
  to,
  message,
  mediaUrl = null
}) => {
  try {
    // Clean phone number
    let phone = to.replace(/\s/g, '').replace(/[^0-9+]/g, '');
    if (phone.startsWith('0')) {
      phone = '+234' + phone.slice(1);
    }
    if (!phone.startsWith('+')) {
      phone = '+234' + phone;
    }

    const payload = {
      api_key: TERMII_API_KEY,
      to: phone,
      from: 'ReviewBoost',
      sms: message,
      type: 'plain',
      channel: 'whatsapp'
    };

    const response = await termii.post('/sms/send', payload);
    return { success: true, data: response.data };

  } catch (error) {
    console.error('WhatsApp send error:', error.response?.data || error);
    return { success: false, error: error.message };
  }
};

export const sendSMS = async ({ to, message }) => {
  try {
    let phone = to.replace(/\s/g, '');
    if (phone.startsWith('0')) {
      phone = '+234' + phone.slice(1);
    }

    const response = await termii.post('/sms/send', {
      api_key: TERMII_API_KEY,
      to: phone,
      from: 'ReviewBoost',
      sms: message,
      type: 'plain',
      channel: 'generic'
    });

    return { success: true, data: response.data };

  } catch (error) {
    return { success: false, error: error.message };
  }
};

// WhatsApp review request message
export const createReviewRequestMessage = (
  customerName,
  businessName,
  reviewLink
) => {
  return `Hi ${customerName}! 👋

Thank you for visiting *${businessName}*! 🙏

We'd love to hear about your experience. Could you take just *30 seconds* to leave us a Google review?

⭐ Click here to review us:
${reviewLink}

Your feedback helps us serve you better and helps other customers find us!

Thank you so much! 😊

_${businessName}_`;
};