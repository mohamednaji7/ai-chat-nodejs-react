import express from 'express';
import ChatService from '../services/ChatService.js';

const router = express.Router();


router.get('/history/:id',  async (req, res)=>{
    try{
        const chatId = req.params.id




        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        // console.log('Chat History:', history);
        
        res.status(200).send(history)
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }

});


export default router;