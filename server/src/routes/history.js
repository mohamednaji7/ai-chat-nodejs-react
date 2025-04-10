import express from 'express';
import ChatService from '../services/Database/ChatService.js';
import AuthService from '../services/Auth/AuthService.js';
const router = express.Router();


router.get('/history/:id',  async (req, res)=>{
    console.log('[/history]')
    try{
        const threadId = req.params.id


        // if(await AuthService.authorizeUserChat(req.user.email, threadId) == false){
        //     res.status(403).send('Unauthorized')
        //     return
        // }

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        let history = await ChatService.getChatHistory(threadId);
        // console.log('Chat History:', history);
        
        // history = history.filter((message) => {
        //     return message.role === 'user' 
        //         || message.role === 'assistant' && message.content  
        // }
        // );
        
        res.status(200).send(history)
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }

});


export default router;