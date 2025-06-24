// src/services/AI/utils/utils.js

import { getCompletion } from '../../OpenaiProviders.js';
import {genTitlePrompt} from './prompts.js';
import ChatService from '../../Database/ChatService.js';

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
          genTitlePrompt(user.user_metadata.full_name,  conversation)
      )
      
  console.log('completion')

  // console.log(completion)
  // consoleLog(completion.choices[0].message)
  const newTitle =  completion.choices[0].message.content;
  return newTitle

}



const processToolCalls = async (tools, toolCalls, session) => {
  console.log('processToolCalls')
  const tool_messages = [];
  const {chatId} = session
  if(!chatId) throw new Error('missing chat id in processing tool calls');
  for (const toolCall of toolCalls) {
    let result;
    try {
      console.log("toolCall", toolCall)
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
  
      if (tools[name] === undefined) {
        result = `${name} is not a valid tool\n ${args} \n${toolCall.id}`
        console.error({result})
      }else{
        result = await tools[name](args, session)
        if (result === undefined || result === null) {
                  result = `Tool ${name} returned no nothing for tool call ${toolCall.id}`;
        }
        console.log("tool_messages added a new result", result   )

      }
    }
    catch (error ) {
      result = `Error execuating tool call: ${toolCall.id}}`;
      console.error(result, error)
    }

    // console.log("result", result)
    const tool_message ={
        role: "tool",
        tool_call_id: toolCall.id,
        content: result.toString()
    }
    tool_messages.push(tool_message);
    await ChatService.addMessageJSONB(chatId, 'tool', tool_message);
  }
  return tool_messages;
 
}



export { 
  processToolCalls,
  genTitle,
  stageMsgs,
};
