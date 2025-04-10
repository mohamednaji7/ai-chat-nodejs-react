import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.AZURE_OPENAI_KEY 
const endpoint = process.env.AZURE_OPENAI_ENDPOINT
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME 
const apiVersion = process.env.OPENAI_API_VERSION
const EMBEDDING_MODEL = process.env.AZURE_EMBEDDING_DEPLOYMENT

if (!apiKey || !endpoint || !deployment || !apiVersion ) {
  throw new Error('Missing Environment Variable');
}



// Get Azure SDK client
const getClient = (deployment) => {
  
  const assistantsClient = new AzureOpenAI({
    endpoint: endpoint,
    apiVersion: apiVersion,
    apiKey: apiKey,
    deployment: deployment
  });

  return assistantsClient;

};

const openai = getClient(deployment);
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
    model: process.env.AZURE_OPENAI_MODELID,
});
  return completion
}



export { 
  openai,
  getEmbedding,
  getCompletion,
};
