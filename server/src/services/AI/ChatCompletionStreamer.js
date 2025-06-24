// src/services/AI/WorkflowsAssistant.js

import {openai} from '../OpenaiProviders.js';
import {SystemInstruction} from './utils/prompts.js';


import ChatService from '../Database/ChatService.js';

const MODEL = process.env.LLM_MODEL_NAME


const ChatCompletionStreamer = async (session, prompt, user, res) => {
    const {chatId} = session
    session.AI_Provider = process.env.AI_PROVIDER
    console.log('[ChatCompletionStreamer]')
    if(res) console.log('Sending stream response to client');

    try {

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        console.log('Chat History:');
        // console.log(history);
        console.log('length:', history.length);
                
        const messages = [
        {
            role: "system",
            content: SystemInstruction(user.user_metadata.full_name, user.email)
        },
        ...history.map((msg) => {
            return msg.is_ui_message
                ? {
                    role: msg.role,
                    content: msg.content
                }
                : msg.message
        })
        ,
        {
            role: "user",
            content: prompt
        }
        ];

        // Save user message first
        const userMsgData = await ChatService.addMessage(
            chatId, 'user',  prompt
        );
        console.log(` ---- User (${user.loggingname? user.loggingname:user.user_metadata.full_name}) Message Added ${userMsgData._id}`);


        let accumulatedResponse = '';
        const stream = await openai.chat.completions.create({
            model: MODEL,
            messages: messages,
            stream: true,
        });

        let chunkI = 0;
        console.log('chunk.choices[0]')
        for await (const chunk of stream) {
            // console.log(chunk.choices[0])
            const content = chunk.choices[0]?.delta?.content || ""
            // process.stdout.write(content);
            if (content){
                // Send chunk to client
                try{
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
                catch(error){
                    console.log('Connection closed, skipping response')
                }
                accumulatedResponse += content;
                // console.log('i:', chunkI, 'content:', content);
                chunkI++;
            }
        }

        console.log({accumulatedResponse});

        // Save complete assistant message
        const assistantMsgData = await ChatService.addMessage(
            chatId, 'assistant', accumulatedResponse
        );
        console.log('Assistant Message Added', assistantMsgData._id);
        
        // Send final message with IDs
        res.write(`data: ${JSON.stringify({ 
            done: true,
            userMsgId: userMsgData._id,
            assistantMsgId: assistantMsgData._id
        })}\n\n`);
               

    }catch(error){
        console.error("ChatCompletionStreamer error:");
        console.error(error);
        throw error;
    }
    
}  
export default ChatCompletionStreamer