// src/routes/project-files.js

import express from 'express';
import Project from '../services/Database/Project.js';


const router = express.Router();

router.get('/project-files', async (req, res) => {
  
  try {
    const {project_id, file_id} = req.query;
    //log the params 
    console.log('project-files', project_id, file_id)
    
    if(file_id){
      const file = await Project.getProjectFile(file_id);
      res.status(200).send(file);
    }else{
      if (!project_id) return res.status(400).send('project_id is required');
      const files = await Project.getProjectFiles(project_id);
      res.status(200).send(files);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting project files!');
  }
});

export default router;