import express from 'express';
import ChatService from '../services/ChatService.js';
import openai from '../services/OpenAI.js';

const router = express.Router();
const stageMsgs = (history, prompt) => {
    const messages = history.map((msg) => ({
        role: msg.role,
        content: msg.content
    }));
    messages.push({ role: 'user', content: prompt });
    return messages;
}
router.post('/prompt-stream', requireAuth(), async (req, res) => {
    console.log(`[ /prompt-stream ]`);
    console.log({body: req.body})

    const { chatId, prompt } = req.body;


    try {
        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        

        // Start streaming
        console.log('[openai] [chatCompleteStream]')
        const stream = await openai.chat.completions.create({
            model: process.env.MODEL_ID,
            messages: stageMsgs(history, prompt),
            stream: true,
          });
          
        let accumulatedResponse = '';
        
        let chunkIdx = 0;
        for await (const chunk of stream) {
            console.log('[prompt-stream] [chunk]', chunkIdx);
            const content = chunk.choices[0]?.delta?.content || '';
            
            // Send chunk to client
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
            accumulatedResponse += content;
            chunkIdx += 1;
        }
        console.log('accumulatedResponse', accumulatedResponse)

        // Save user message first
        const userMsgData = await ChatService.addMessage(chatId, 'user', prompt);
        console.log('User Message Added', userMsgData._id);

        // Save complete assistant message
        const assistantMsgData = await ChatService.addMessage(chatId, 'assistant', accumulatedResponse);
        console.log('Assistant Message Added', assistantMsgData._id);

        // Send final message with IDs
        res.write(`data: ${JSON.stringify({ 
            done: true,
            userMsgId: userMsgData._id,
            assistantMsgId: assistantMsgData._id 
        })}\n\n`);
        
        res.end();

    } catch (err) {
        console.error(err);
        res.write(`data: ${JSON.stringify({ error: 'Error processing stream' })}\n\n`);
        res.end();
    }
});

export default router;