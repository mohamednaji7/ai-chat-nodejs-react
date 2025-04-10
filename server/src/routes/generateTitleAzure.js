import express from 'express';
import ChatService from '../services/Database/ChatService.js';
import {genTitle} from '../services/AI/utils.js'
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();


router.post('/generate-title', async (req, res)=>{
    console.log(`[ /generate-title ] [azureOpenAIClient]`)
    console.log({body: req.body})
    try{
        const {chatId} = req.body


        // Get chat history
        console.log('[ChatService] [getChatHistory]');
        const history = await ChatService.getChatHistory(chatId);

        if (!history) {
            throw new Error(`No chat history found for chatId: ${chatId}`);
        }
        if (!Array.isArray(history)) {
            throw new Error(`Chat history is not an array for chatId: ${chatId}`);
        }


        const newTitle = await genTitle(req.user, history)
        
        console.log('newTitle', newTitle)
        console.log('ChatService.updateChatTitle')
        await ChatService.updateChatTitle(chatId, newTitle)
        res.status(200).send({newTitle})
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error generating a new title!')
    }
});


export default router;