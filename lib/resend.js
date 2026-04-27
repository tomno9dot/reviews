import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReviewRequest = async ({
  customerName,
  customerEmail,
  businessName,
  googleReviewLink,
  reviewRequestId  // For tracking
}) => {
  
  const trackingPixel = `${process.env.NEXT_PUBLIC_APP_URL}/api/reviews/track/${reviewRequestId}`;
  
  const { data, error } = await resend.emails.send({
    from: `${businessName} <reviews@yourdomain.com>`,
    to: customerEmail,
    subject: `How was your experience at ${businessName}? ⭐`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0; padding:0; background:#f5f5f5; font-family: Arial, sans-serif;">
          
          <div style="max-width:560px; margin:40px auto; background:white; border-radius:16px; overflow:hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:40px; text-align:center;">
              <h1 style="color:white; margin:0; font-size:28px;">
                Thank You! 🙏
              </h1>
            </div>
            
            <!-- Body -->
            <div style="padding:40px;">
              <p style="font-size:18px; color:#333; margin-bottom:10px;">
                Hi <strong>${customerName}</strong>,
              </p>
              
              <p style="font-size:16px; color:#555; line-height:1.6;">
                Thank you for visiting <strong>${businessName}</strong>! 
                We hope you had a wonderful experience.
              </p>
              
              <p style="font-size:16px; color:#555; line-height:1.6;">
                Could you take <strong>30 seconds</strong> to share 
                your experience? Your review helps other customers 
                discover us! ⭐
              </p>
              
              <!-- Stars display -->
              <div style="text-align:center; margin:20px 0; font-size:36px;">
                ⭐⭐⭐⭐⭐
              </div>
              
              <!-- CTA Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${googleReviewLink}" 
                   style="display:inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color:white; padding:18px 40px; border-radius:50px; text-decoration:none; font-size:18px; font-weight:bold; box-shadow: 0 4px 15px rgba(102,126,234,0.4);">
                  ⭐ Leave a Review
                </a>
              </div>
              
              <p style="font-size:14px; color:#999; text-align:center;">
                It only takes 30 seconds!
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background:#f8f8f8; padding:20px; text-align:center;">
              <p style="color:#999; font-size:12px; margin:0;">
                This email was sent by ${businessName}<br>
                <a href="${trackingPixel}?action=unsubscribe" 
                   style="color:#999;">
                  Unsubscribe
                </a>
              </p>
            </div>
          </div>
          
          <!-- Tracking pixel -->
          <img src="${trackingPixel}?action=open" 
               width="1" height="1" 
               style="display:none;" 
               alt="">
        </body>
      </html>
    `
  });

  if (error) throw new Error(error.message);
  return data;
};