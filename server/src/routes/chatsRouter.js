import express from 'express';
import ProfileService from '../services/ProfileService.js';
const router = express.Router();


router.get('/chats',  async (req, res)=>{
    console.log('[/chats]')
    try{
        console.log({'[ProfileService]': '[getUserChats]'})


    
        // Get the user chats
        // console.log(req.user)
        const userChats = await ProfileService.getUserChats(req.user.sub);
        console.log('User Chats: ', userChats.length);
        // console.log(userChats);

        
        res.status(200).send(userChats)

    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }
});


export default router;