import express from 'express';
import streamChatCompletion from '../services/AI/ChatCompletion.js';
import AuthService from '../services/Auth/AuthService.js';

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




        if(await AuthService.authorizeUserChat(req.user.email, chatId) == false){
            res.status(403).send('Unauthorized')
            return
        }
        

        const params = [chatId,
            prompt,
            req.user,
            res]
        
        let accumulatedResponse; 

        accumulatedResponse = await streamChatCompletion(...params)
        
        
        
        // console.log({accumulatedResponse})


        
        res.end();
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new prompt!')
    }
});


export default router;