// src/routes/projects.test.js

// routes/projects.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import projectRouter from './project.js'; 

let app;


beforeEach(() => {
  app = express();
  app.use(express.json());

  // 👇 Mock middleware to inject a fake user
  app.use((req, res, next) => {
    req.user = { sub: user_id };
    next();
  });


  // 👇 Mount only the router you want to test
  app.use('/api/v1', projectRouter);
});

describe('POST /project', () => {
  it('should return a project', async () => {
    // const res = await request(app).psot('/api/v1/project');
    // send with body.name = 'Techna' 
    const res = await request(app).post('/api/v1/project').send({name: 'VITEST'});
    console.log(res.body);
    expect(res.statusCode).toBe(200);
  });
});
