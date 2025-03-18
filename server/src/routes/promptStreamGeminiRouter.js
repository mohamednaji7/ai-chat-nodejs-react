import express from 'express';
import ChatService from '../services/ChatService.js';
// import {embed} from '../services/OpenAI.js'
// import {retrieveDocuments} from '../services/RAG.js'
import dotenv from 'dotenv';
dotenv.config();

import {SystemInstruction} from '../prompts.js';
// import {SysRagInst} from '../prompts.js';

import {model} from '../services/Gemini.js'


const stageHistory = (history) =>{
    return history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{text: msg.content}]
        }));
        
}

const router = express.Router();


router.post('/prompt-stream', async (req, res)=>{
    console.log(`[ /prompt-stream ] [Gemini]`)
    console.log({body: req.body})
    // Extract user authentication info from Clerk middleware
    const { sessionClaims } = req.auth;    
    // Get the email from session claims
    try{
        const {chatId, prompt} = req.body

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');


        console.log('systemInstruction')
        const systemInstructionText = SystemInstruction(
            sessionClaims.full_name,
             sessionClaims.email
            ) 
        


        // const promptEmbds = await embed(prompt)
        // console.log('promptEmbds')
        // // console.log({promptEmbds})
        // console.log('docs', docs.length)
        // const docs = await retrieveDocuments({}, 1, promptEmbds)

        // console.log('SysRagInst')
        // const systemInstructionText = SysRagInst(
        //     sessionClaims.fullname,
        //      sessionClaims.email,
        //      docs[0].content)

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        // console.log('Chat History:', history);


        console.log('[startChat] geminiHistory')
        console.log({geminiHistory: stageHistory(history)})

        const chat = await model.startChat({ 
            history:  stageHistory(history),
            systemInstruction:
            {
                parts: [
                    {text: systemInstructionText}
                ],
              },
         });

         let accumulatedResponse = '';
         let chunkIdx = 0;
        console.log('[sendMessage]')
        let result = await chat.sendMessageStream(prompt );

        for await (const chunk of result.stream) {
            console.log('[prompt-stream] [chunk] [gemini]', chunkIdx);
            const content = chunk.text();
            // process.stdout.write(content);

            // Send chunk to client
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
            accumulatedResponse += content;
            chunkIdx += 1;
          }
        
        console.log('accumulatedResponse')
        //   console.log({accumulatedResponse})

        // Add messages
        console.log('[ChatService] [addMessage]')

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
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new prompt!')
    }
});


export default router;