import express from 'express';
import ChatService from '../services/ChatService.js';
import dotenv from 'dotenv';
dotenv.config();
import { geTtitlePrompt} from '../prompts.js';

import {model} from '../services/Gemini.js'

const stageHistory = (history) =>{
    return history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{text: msg.content}]
        }));
        
}

const router = express.Router();


router.post('/generate-title', async (req, res)=>{
    console.log(`[ /prompt-stream ] [Gemini]`)
    console.log({body: req.body})

    // Extract user authentication info from Clerk middleware
    const { sessionClaims } = req.auth;    
    // Get the email from session claims

    try{
        const {chatId, prompt} = req.body


        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        // console.log('Chat History:', history);
        const conversation = history.map((msg) => `${msg.role=='assistant'?'model':'user'}: ${msg.content}`).join('\n')

        
        const result = await model.generateContent(
            geTtitlePrompt(sessionClaims.fullname, sessionClaims.email, conversation)
        );
        console.log(result.response.text())
        const newTitle =  result.response.text().trim()
        ChatService.updateChatTitle(chatId, newTitle)
        res.status(200).send({newTitle})
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error generating a new title!')
    }
});


export default router;