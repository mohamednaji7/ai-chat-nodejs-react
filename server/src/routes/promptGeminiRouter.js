import express from 'express';
import ChatService from '../services/ChatService.js';
import dotenv from 'dotenv';
dotenv.config();


import {GoogleGenerativeAI} from '@google/generative-ai';



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const stageHistory = (history) =>{
    return history.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{text: msg.content}]
        }));
        
}

const router = express.Router();


router.post('/prompt',  async (req, res)=>{
    console.log(`[ /prompt ] [Gemini]`)
    console.log({body: req.body})
    try{
        const {chatId, prompt} = req.body

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        // console.log('Chat History:', history);

        const chat = model.startChat({ history: stageHistory(history) });
        let result = await chat.sendMessage(prompt );
        
        console.log('result', result)

        console.log(result.response.text())
        const response =  result.response.text()

        // Add messages
        console.log('[ChatService] [addMessage]')
        const userMsgData = await ChatService.addMessage(chatId, 'user', prompt);
        const userMsgData_id = userMsgData._id
        console.log('User Message Added', userMsgData_id);
        
        const assistantMsgData = await ChatService.addMessage(chatId, 'assistant', response);
        const assistantMsgData_id = assistantMsgData._id
        console.log('Assistant Message Added', assistantMsgData_id);


        res.status(200).send({userMsgData_id, response, assistantMsgData_id})

        
    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new prompt!')
    }
});


export default router;