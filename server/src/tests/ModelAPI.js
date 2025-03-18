import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();


const openai = new OpenAI({
  baseURL: process.env.baseURL,
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    // 'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    // 'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});



async function main() {
    const stream = await openai.chat.completions.create({
        model: process.env.MODEL_ID,
        messages: [{ role: "user", content: "Hi" }],
        stream: true,
      });
    for await (const chunk of stream) {
        // process.stdout.write(chunk.choices[0]?.delta?.content || "");
        // console.log(chunk.choices[0]?.delta)
        console.log("Streamed response: ", chunk.choices[0]?.delta?.content);
        // console.log(chunk)
        // break
    }
}

main();