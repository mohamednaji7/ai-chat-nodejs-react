import { getCompletion } from '../../AzureOpenAI.js';
import {genTitlePrompt} from './prompts.js';

const stageMsgs = (history, prompt) => {
  const messages = history.map((msg) => ({
      role: msg.role,
      content: msg.content
  }));
  messages.push({ role: 'user', content: prompt });
  return messages;
}

const genTitle = async (user, history) => {

  if (!Array.isArray(history)) {
    console.error("Error: history is not an array", history);
    throw new Error("Chat history is not an array");
}

  // const conversation = history.map((msg) => `${msg.role}: ${msg.content}`).join('\n\n')
  // MAKE THE CONVERSTION OF THE user, and assistant and content is not empty 
  const conversation = history
  .filter((msg) => 
    (msg.role === 'user' || msg.role === 'assistant') && // Only include user or assistant roles
    msg.content && msg.content.trim() !== ''            // Ensure content is not empty or just whitespace
  )
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join('\n\n');

  console.log('chat completions')
  
  const completion = await getCompletion(
          genTitlePrompt(user.username,  conversation)
      )
      
  console.log('completion')

  // console.log(completion)
  // consoleLog(completion.choices[0].message)
  const newTitle =  completion.choices[0].message.content;
  return newTitle

}

export { 
  genTitle,
  stageMsgs
};
