// src/routes/projects.js

import express from 'express';
import Project from '../services/Database/Project.js';


const router = express.Router();

router.post('/project', async (req, res) => {
  try {
    // log edpoint 
    console.log('POST /project');
    //log dta 
    console.log('req.user');
    // console.log(req.user);
    console.log('req.body');
    console.log(req.body);
    const project_name = req.body.name 
    if (!project_name) {
      return res.status(400).send('Missing project name!');
    }

    const userId = req.user.sub;
    console.log('userId');
    console.log(userId);
    const project = await Project.createProject(userId, project_name);
    res.status(200).send(project);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting user projects!');
  }
});

export default router;