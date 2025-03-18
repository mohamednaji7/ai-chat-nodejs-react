
import dotenv from 'dotenv';
dotenv.config();


import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.baseURL,
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    // 'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    // 'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

export default openai;

