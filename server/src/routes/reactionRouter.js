import express from 'express';
import ChatService from '../services/ChatService.js';
import dotenv from 'dotenv';
dotenv.config();



const router = express.Router();


router.post('/reaction', async (req, res)=>{
    console.log(`[ /reaction ]`)
    // console.log({body: req.body})
    const {messageId, reaction} = req.body
    try{

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