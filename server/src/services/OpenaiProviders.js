// src/services/AzureOpenAI.js

import OpenAI from 'openai';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();


const EMBEDDING_MODEL = process.env.AZURE_EMBEDDING_DEPLOYMENT





// Get Azure SDK client
const getClient = () => {
  
  let client;

  if (process.env.AI_PROVIDER=== 'azure') { // Azure OpenAI

    const apiKey = process.env.AZURE_OPENAI_KEY 
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME 
    const apiVersion = process.env.OPENAI_API_VERSION
    // const EMBEDDING_MODEL = process.env.AZURE_EMBEDDING_DEPLOYMENT
    

    if (!apiKey || !endpoint || !deployment || !apiVersion ) {
      throw new Error('Missing Environment Variable');
    }

    client = new AzureOpenAI({
      endpoint: endpoint,
      apiVersion: apiVersion,
      apiKey: apiKey,
      deployment: deployment
    });

  }else{// Gemini OpenAI compatibility
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Missing Environment Variable. Please set GEMINI_API_KEY');
    }
    else{
      // Gemini OpenAI compatibility
      console.log('Gemini OpenAI compatibility')
      console.log(process.env.GEMINI_API_KEY)
    }
    client = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });    
  }


  return client;

};

const openai = getClient();

const openiRAG = getClient(EMBEDDING_MODEL);

const getEmbedding = async (text) => {
  const response = await openiRAG.embeddings.create({
    input: text,
    // model: EMBEDDING_MODEL,
    model: "text-embedding-3-small",
  });
  return response.data[0].embedding;
};



const getCompletion = async (userMessage) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: userMessage }],
    model: process.env.LLM_MODEL_NAME,
});
  return completion
}


export { 
  openai,
  getEmbedding,
  getCompletion,
};
