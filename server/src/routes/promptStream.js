// src/routes/promptStream.js

import express from 'express';
import ChatCompletionStreamer from '../services/AI/ChatCompletionStreamer.js';
import AgentStreamer from '../services/AI/AgentStreamer.js';
import AuthService from '../services/Auth/AuthService.js';
import SupabaseClient from '../services/SupabaseClient.js';

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




        if(await AuthService.authorizeUserChat(req.user.sub, chatId) == false){
            res.status(403).send('Unauthorized')
            return
        }

        const { data, error } = await SupabaseClient
            .from('chat')
            .select('project_id')
            .eq('_id', chatId)
            .single();

        if (error) throw error;
            
        const projectId = data.project_id

        const session = {
            projectId,
            chatId
        }
        const params = [session,
            prompt,
            req.user,
            res]

        if (process.env.AI_PROVIDER === 'azure'){
            await AgentStreamer(...params)
        }else{
            await ChatCompletionStreamer(...params)
        }
        


        
        res.end();
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new prompt!')
    }
});


export default router;