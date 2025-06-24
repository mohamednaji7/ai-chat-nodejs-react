// src/services/AI/WorkflowsAssistant.js

import {openai} from '../OpenaiProviders.js';
import {SystemInstruction} from './utils/prompts.js';

import {processToolCalls} from './utils/utils.js';

import ChatService from '../Database/ChatService.js';


import getTime from './fnCalls/getTime.js'
import getFileContent from './fnCalls/getFileContent.js'

const MODEL = process.env.LLM_MODEL_NAME

const all_tools = [
    getTime,
    getFileContent,
]
const parallel_tool_calls =  false
                // if tool calls more than 1, then error and lets do not get distract, we human do not do things in parallel, its a myth


const tools = all_tools.map(tool => tool.openai_tool);

const dict_tools = all_tools.reduce(
    (acc, tool) => {
        acc[tool.openai_tool.function.name] = tool.functionImpl;
        return acc;
    },
    
    {}
)

// console.log('tools', tools)
// console.log('dict_tools', dict_tools)

// import deepResearchPomptStreamer from './workflows/DeepResearch/fn.js';
// const promptSreamers = {
//     'deepResearchPomptStreamer': deepResearchPomptStreamer
// }
// const promptSreamerNames = Object.keys(promptSreamers)

const AgentStreamer = async (session, prompt, user, res) => {
    const {chatId} = session
    session.AI_Provider = process.env.AI_PROVIDER
    console.log('[AgentStreamer]')
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


        let accumulatedResponse;
        while (true){
            accumulatedResponse = '';
            const stream = await openai.chat.completions.create({
                model: MODEL,
                messages: messages,
                tools,
                parallel_tool_calls,
                stream: true,
            });
            

            
            const finalToolCalls = {};
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
                // if tool calls more than 1, then error and lets do not get distract, we human do not do things in parallel, its a myth
                // TO DO 
                console.log(`### tool calls length: ${toolCalls.length}`)
            
                // Append the assistant's message with tool_calls to messages
                const toolCallsAssistantMsg = {
                    "role": "assistant",
                    "content": accumulatedResponse? accumulatedResponse : null, 
                    "refusal": null, 
                    "tool_calls":  toolCalls
                }

                // IF not STREAMING 
                // messages.push(completion.choices[0].message);

                // append model's function call message
                messages.push(toolCallsAssistantMsg)
                // save in databse 
                // TO DO 
                await ChatService.addMessageJSONB(chatId, 'assistant', toolCallsAssistantMsg);


                // for (const toolCall of toolCalls) {
                //     const name = toolCall.function.name;
                //     if (promptSreamerNames.includes(name)) {
                //         console.log('changePromptStreamer', name)
                //         await promptSreamers[name](session, res, user, messages);
                //         return;
                //         // if there other tool, calls should handeledm  because every too call neds response wth its ids
                //         // but we allowinf only one tool call at a time
                        
                //     }
                // }
                    
                const tool_messages = await processToolCalls(dict_tools, toolCalls, session);
                messages.push(...tool_messages);
                // save in databse
                // TO DO >> added when processing the processToolCalls function
            }
            else{

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



    
                break;
            }

        }
                

    }catch(error){
        console.error("AgentStreamer error:");
        console.error(error);
        throw error;
    }
    
}  
export default AgentStreamer