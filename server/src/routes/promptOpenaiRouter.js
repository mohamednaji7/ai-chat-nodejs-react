import express from 'express';
import ChatService from '../services/ChatService.js';
import openai from '../services/OpenAI.js';

const router = express.Router();

const stageMsgs = (history, prompt) => {
    const messages = history.map((msg) => ({
        role: msg.role,
        content: msg.content
    }));
    messages.push({ role: 'user', content: prompt });
    return messages;
}

router.post('/prompt',  async (req, res)=>{
    console.log(`[ /prompt ]`)
    console.log({body: req.body})
    try{
        const {chatId, prompt} = req.body

        // Use `getAuth()` to get the user's `userId`
        const { userId } = getAuth(req)
        console.log(userId)

        // Get chat history
        console.log('[ChatService] [getChatHistory]')
        const history = await ChatService.getChatHistory(chatId);
        console.log('Chat History:', history);



        const completion = await openai.chat.completions.create({
            model: process.env.MODEL_ID,
            messages: stageMsgs(history, prompt),
        });

        console.log('completion', completion)

        console.log(completion.choices[0].message)
        const response =  completion.choices[0].message.content;

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