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
    console.log(`[ /generate-title ] [Gemini]`)
    console.log({body: req.body})


    try{
        const {chatId} = req.body


        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        // console.log('Chat History:', history);
        const conversation = history.map((msg) => `${msg.role=='assistant'?'model':'user'}: ${msg.content}`).join('\n')

        // console.log(req.user.user_metadata)
        const result = await model.generateContent(
            geTtitlePrompt(req.user.user_metadata.full_name , req.user.user_metadata.email, conversation)
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