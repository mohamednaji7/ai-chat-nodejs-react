import OpenAI from "openai";

// CONFIG
import dotenv from 'dotenv';
dotenv.config();


const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  throw new Error('Missing Environment Variable. Please set GEMINI_API_KEY');
}

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const response = await openai.chat.completions.create({
    model: process.env.LLM_MODEL_NAME,
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Hi",
        },
    ],
});

console.log(response.choices[0].message);