// src/routes/chats.js

import express from 'express';
import ProjectService from '../services/Database/Project.js';
const router = express.Router();


router.get('/chats',  async (req, res)=>{
    console.log('[/chats]')
    try{
        console.log({'[ProjectService]': '[getUserChats]'})


    
        const { project_id } = req.query;
        if(!project_id) {
            res.status(400).send('Missing project_id');
            return;
        }
        // console.log('project_id: ', project_id);
        // Get the user chats
        const userChats = await ProjectService.getProjectChats(req.user.sub, project_id);
        console.log('Project Chats:');
        // console.log(userChats);
        console.log(userChats.length);

        
        res.status(200).send(userChats)

    }catch(err){
        console.log(err)
        res.status(500).send('Error creating a new chat!')
    }
});


export default router;