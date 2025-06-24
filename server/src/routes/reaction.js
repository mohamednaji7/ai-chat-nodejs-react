// src/routes/reaction.js

import express from 'express';
import ChatService from '../services/Database/ChatService.js';
import AuthService from '../services/Auth/AuthService.js';

import dotenv from 'dotenv';
dotenv.config();



const router = express.Router();


router.post('/reaction', async (req, res)=>{
    console.log(`[ /reaction ]`)
    // console.log({body: req.body})
    const {chatId, messageId, reaction} = req.body





    try{
        if(await AuthService.authorizeUserChat(req.user.sub, chatId) == false){
            res.status(403).send('Unauthorized')
            console.log('Unauthorized. User not authorized to access this chat.')
            console.log({email: req.user.email})
            console.log({chatId})
            throw new Error('Unauthorized. User not authorized to access this chat.')
        }
    


        // thread names are unique and fixed

        

        await ChatService.updateMessageReaction(messageId, reaction)
        res.status(200).send('Message reaction updated!')
        
    }catch(error){
        console.log(error)
        let errMsg = 'Error updating message reaction!'
        if (error.code == 'PGRST116') errMsg = 'messageId error!'
        if (error.code == '23514') errMsg = 'check reaction in ("UP", "NONE", "DOWN")'

        res.status(500).send({
            messageId,
            reaction,
            message: errMsg,
            code: error.code,
        })
    }
});


export default router;