import {openai} from '../AzureOpenAI.js';
import {SystemInstruction} from './utils/prompts.js';
import {
    
    tools,
    knowledge_base_assistant_instracution,
    processToolCalls

} from './utils/RAG.js';

import ChatService from '../Database/ChatService.js';
import {stageMsgs} from './utils/utils.js';


const MODEL = process.env.AZURE_OPENAI_MODELID



const streamRagHelper = async (chatId, prompt, user, res) => {
    console.log('[streamRagHelper]')
    if(res) console.log('Sending stream response to client');

    try {

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        // console.log('Chat History:', history);
        console.log('Chat History:', history.length);
        
        
        


        const messages = [
            { role: "system", content: SystemInstruction(
                user.user_metadata.full_name, user.email
            ) },
            { role: "system", content: knowledge_base_assistant_instracution },
            ...stageMsgs(history, prompt)
        ]

        const stream = await openai.chat.completions.create({
            model: MODEL,
            messages: messages,
            tools,
            stream: true,
        });
        

        
        let accumulatedResponse = '';
        const finalToolCalls = {};
        let chunkI = 0;
        console.log('chunk.choices[0]')
        for await (const chunk of stream) {
            // console.log(chunk.choices[0])
            const content = chunk.choices[0]?.delta?.content || ""
            // process.stdout.write(content);
            if (content){
                // Send chunk to client
                if(res){
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
                accumulatedResponse += content;
                // console.log('i:', chunkI, 'content:', content);
                chunkI++;
            }


            const toolCalls = chunk.choices[0]?.delta?.tool_calls || [];
            for (const toolCall of toolCalls) {
                const { index } = toolCall;
        
                if (!finalToolCalls[index]) {
                    finalToolCalls[index] = toolCall;
                }
        
                finalToolCalls[index].function.arguments += toolCall.function.arguments;
            }
        }


        console.log(`### tool calls >>>`)
        // console.log(finalToolCalls)
        const toolCalls = Object.values(finalToolCalls).map(
            toolCall => ({
                id: toolCall.id,
                type: "function",
                function: toolCall.function,
            })
        );
        // console.log(`### tool calls: ${JSON.stringify(toolCalls)}`)
        
        if (toolCalls?.length > 0) {    
            console.log(`### tool calls length: ${toolCalls.length}`)
        
            // Append the assistant's message with tool_calls to messages
            const toolCallsAssistantMsg = {
                "role": "assistant",
                "content": null, 
                "refusal": null, 
                "tool_calls":  toolCalls
            }

            // IF not STREAMING 
            // messages.push(completion.choices[0].message);
            
            messages.push(toolCallsAssistantMsg)
                // append model's function call message

            
            const tool_messages = await processToolCalls(toolCalls);
            messages.push(...tool_messages);


        
            const stream2 = await openai.chat.completions.create({
                model: MODEL,
                messages,
                tools,
                stream: true,
            });

            console.log('stream2')

            for await (const chunk of stream2) {
                const content = chunk.choices[0]?.delta?.content || ""
                if (content){
                    accumulatedResponse += content;
                    if(res){
                        res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    }
                    // console.log('i:', chunkI, 'content:', content);
                    chunkI++;
                }
            }

        }

       
        
        if(res){
            // Send final message with IDs
            res.write(`data: ${JSON.stringify({ 
                done: true,
                userMsgId: userMsgData._id,
                assistantMsgId: assistantMsgData._id
            })}\n\n`);
        }

        
        // Save user message first
        const userMsgData = await ChatService.addMessage({thread_id, role: 'user', content: prompt});
        console.log(` ---- User (${user.loggingname? user.loggingname:user.username}) Message Added userMsgData._id`);

        // Save complete assistant message
        const assistantMsgData = await ChatService.addMessage({
            thread_id, role: 'assistant', content: accumulatedResponse
        });
        console.log('Assistant Message Added', assistantMsgData._id);
        
        return accumulatedResponse
        

    }catch(error){
        console.error("RAG HELPER   Stream error:");
        console.error(error);
        throw error;
    }
    
}  
export default streamRagHelper