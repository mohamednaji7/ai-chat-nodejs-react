import express from 'express';
import streamChatCompletion from '../services/AI/ChatCompletion.js';
import streamRagHelper from '../services/AI/RagHelper.js';
import ChatService from '../services/Database/ChatService.js';
import AuthService from '../services/Database/AuthService.js';

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/prompt-stream', async (req, res)=>{
    console.log(`[ /prompt-stream ]`)
    console.log({body: req.body})
    try{
        const {chatId, prompt} = req.body

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');



        const threadId = chatId


        if(await AuthService.authorizeUserChat(req.user.email, threadId) == false){
            res.status(403).send('Unauthorized')
            return
        }
        

        const threadIntelligence = await ChatService.getThreadIntelligence(threadId)
        console.log({'threadIntelligence': threadIntelligence.privilege})

        const params = [threadId,
            prompt,
            req.user,
            res]
        
        let accumulatedResponse; 

        if (threadIntelligence.privilege == 'privilege-rag') {
            accumulatedResponse = await streamRagHelper(...params)
        }
        else if (threadIntelligence.privilege == 'privilege-none') {
            accumulatedResponse = await streamChatCompletion(...params)
        }
        



        // console.log({accumulatedResponse})


        
        res.end();
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new prompt!')
    }
});


export default router;