
import dotenv from 'dotenv';
dotenv.config();


import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const embed = async (text) => {
  const { data, error } = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL,
      input: text
  })
  if (error) throw error
  // console.log('data')
  // console.log(data)
  return data[0].embedding
}

export { openai, embed }