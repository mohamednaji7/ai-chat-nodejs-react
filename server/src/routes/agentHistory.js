import express from 'express';
import ChatService from '../services/Database/ChatService.js';
import AuthService from '../services/Auth/AuthService.js';
const router = express.Router();


router.get('/agent-history/:name',  async (req, res)=>{
    console.log('[/agent-history]')
    try{
        const agentName = req.params.name


        // if(await AuthService.authorizeUserChat(req.user.email, threadId) == false){
        //     res.status(403).send('Unauthorized')
        //     return
        // }

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        console.log({agentName})
        let history = await ChatService.getAgentChatHistory(agentName);
        // console.log('Chat History:', history);
        console.log('Chat History:', history);
        res.status(200).send(history)
        // res.status(200).send(null)
        
        // history = history.filter((message) => {
        //     return message.role === 'user' 
        //         || message.role === 'assistant' && message.content  
        // }
        // );
        // if (agentName==='personal-agent') {
        //     res.status(200).send(null)
        // }
        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }

});


export default router;