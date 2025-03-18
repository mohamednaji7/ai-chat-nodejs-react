import express from 'express';
import ChatService from '../services/ChatService.js';

const router = express.Router();


router.post('/chat',  async (req, res)=>{
    console.log({body: req.body})
    try{
        const {title} = req.body



        // Create a new chat
        console.log({'[ChatService]' : '[createChat]'})
        const newChat = await ChatService.createChat(req.user.sub, title, "default-model");
        console.log('Chat Created:', newChat);
        res.status(200).send(newChat)

    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }
});


export default router;