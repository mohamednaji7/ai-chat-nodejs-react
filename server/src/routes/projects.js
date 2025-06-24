// src/routes/projects.js

import express from 'express';
import Project from '../services/Database/Project.js';


const router = express.Router();

router.get('/projects', async (req, res) => {
  try {
    // log edpoint 
    console.log('GET /projects');
    //log dta 
    console.log('req.user');
    // console.log(req.user);

    const userId = req.user.sub;
    const projects = await Project.getUserProjects(userId);
    res.status(200).send(projects);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting user projects!');
  }
});

export default router;