import OpenAI from 'openai';

// npm install openai
// OR use free alternative: Groq API (groq.com - FREE)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // For Groq (FREE alternative):
  // baseURL: 'https://api.groq.com/openai/v1',
  // apiKey: process.env.GROQ_API_KEY
});

export async function generateReviewResponse({
  reviewText,
  rating,
  businessName,
  businessType,
  tone = 'professional'
}) {
  const toneInstructions = {
    professional: 'professional and formal',
    friendly: 'warm, friendly and casual',
    enthusiastic: 'very enthusiastic and grateful'
  };

  const ratingContext = rating >= 4
    ? 'This is a positive review. Thank them warmly.'
    : rating === 3
    ? 'This is a neutral review. Acknowledge their feedback and show improvement.'
    : 'This is a negative review. Be empathetic, apologize professionally, and offer to make it right.';

  const prompt = `You are a ${businessType} business owner named "${businessName}".

Write a ${toneInstructions[tone]} response to this ${rating}-star Google review.

Review: "${reviewText}"

Instructions:
- ${ratingContext}
- Keep it under 80 words
- Be genuine and personal (mention specific things from the review if possible)
- Include the business name naturally
- End with an invitation to return
- Do NOT use generic phrases like "Thank you for your feedback"
- Write in first person as the business owner
- Only return the response text, nothing else`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // cheap and fast
    // For Groq: model: 'llama3-8b-8192' (completely free)
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.7
  });

  return completion.choices[0].message.content.trim();
}

// Generate 3 variations
export async function generateMultipleResponses({
  reviewText,
  rating,
  businessName,
  businessType
}) {
  const tones = ['professional', 'friendly', 'enthusiastic'];

  const responses = await Promise.all(
    tones.map(tone =>
      generateReviewResponse({
        reviewText,
        rating,
        businessName,
        businessType,
        tone
      })
    )
  );

  return responses.map((response, i) => ({
    tone: tones[i],
    response
  }));
}