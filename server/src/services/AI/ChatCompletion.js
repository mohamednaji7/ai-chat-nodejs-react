import {openai} from '../AzureOpenAI.js';
import {SystemInstruction} from './utils/prompts.js';
import ChatService from '../Database/ChatService.js';
import {stageMsgs} from './utils/utils.js';

const streamChatCompletion = async (chatId, prompt, user, res) => {
    console.log('[streamChatCompletion]')


    
    // Get chat history
    console.log('[ChatService] [getChatHistory]')
    const history = await ChatService.getChatHistory(chatId);
    // console.log('Chat History:', history);
    
    
    

    // const messages = stageMsgs(history, prompt)
    // console.log(SystemInstruction(user.user_metadata.full_name, user.email))
    // console.log(user)
    const messages = [
        {
            role: 'system',
            content: SystemInstruction(user.user_metadata.full_name, user.email)
        },
        ...stageMsgs(history, prompt)
    ]

    const stream = await openai.chat.completions.create({
        // messages: [{ role: "user", content: prompt }],
        messages: messages,
    
        model: process.env.AZURE_OPENAI_MODELID,
        stream: true, // Enable streaming
    });
    
    console.log(` ---- User (${user.loggingname?user.loggingname:user.user_metadata.full_name}) Message Added userMsgData._id`);

    let accumulatedResponse = '';
    let chunkIdx = 0;
    for await (const chunk of stream) {
        // console.log('[chunk] [AzureOpenAI]', chunkIdx);
        const content = chunk.choices[0]?.delta?.content || ""
        // process.stdout.write(content);
        if (content){
            // Send chunk to client
            if(res){
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
            accumulatedResponse += content;
            chunkIdx += 1;
        }
    }


    // Save user message first
    const userMsgData = await ChatService.addMessage(
         chatId, 'user',  prompt
    );
    console.log('User Message Added', userMsgData._id);

    // Save complete assistant message
    const assistantMsgData = await ChatService.addMessage(
        chatId, 'assistant',  accumulatedResponse 
    );
    
    console.log('Assistant Message Added', assistantMsgData._id);

    if (res){
        // Send final message with IDs
        res.write(`data: ${JSON.stringify({ 
            done: true,
            userMsgId: userMsgData._id,
            assistantMsgId: assistantMsgData._id
        })}\n\n`);
}

    
    return accumulatedResponse
    

    
}  


export default streamChatCompletion