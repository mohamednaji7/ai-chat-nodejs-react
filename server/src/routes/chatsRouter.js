import express from 'express';
import ProfileService from '../services/ProfileService.js';
const router = express.Router();


router.get('/chats',  async (req, res)=>{
    console.log('[/chats]')
    try{
        console.log({'[ProfileService]': '[getUserChats]'})


        // Extract user authentication info from Clerk middleware
        const { sessionClaims } = req.auth;    
        // Get the email from session claims
    
        // Get the user chats
        const userChats = await ProfileService.getUserChats(sessionClaims.email);
        console.log('User Chats:');
        // console.log(userChats);
        console.log(userChats.length);

        
        res.status(200).send(userChats)

    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }
});


export default router;