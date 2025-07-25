// src/routes/chat.js

import express from 'express';
import ChatService from '../services/Database/ChatService.js';

const router = express.Router();


router.post('/chat',  async (req, res)=>{
    console.log({body: req.body})
    try{
        const { project_id, title} = req.body

        
        // Create a new chat
        console.log({'[ChatService]' : '[createChat]'})

        const modelName = process.env.LLM_MODEL_NAME


        const newChat = await ChatService.createChat(
            req.user.sub, 
            project_id,
            title, 
            modelName,
                    );
        // console.log('Chat Created:', newChat);
        res.status(200).send(newChat)

    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }
});


export default router;