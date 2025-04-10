import express from 'express';
import ChatService from '../services/Database/ChatService.js';

const router = express.Router();


router.post('/chat',  async (req, res)=>{
    console.log({body: req.body})
    try{
        const { title} = req.body

        
        // Create a new chat
        console.log({'[ChatService]' : '[createChat]'})

        const generation = 'generation-0' 
        let privilege = 'privilege-rag'
        const modelName =  "model-gpt-4o-mini" 

        if (req.body.privilege === 'none' ){
            privilege = 'privilege-none'
        }

        const newChat = await ChatService.createChat(
            req.user.sub, 
            title, 
            generation, 
            privilege, 
            modelName
                    );
        // console.log('Chat Created:', newChat);
        res.status(200).send(newChat)

    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }
});


export default router;