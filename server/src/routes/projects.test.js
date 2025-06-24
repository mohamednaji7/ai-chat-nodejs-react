// src/routes/projects.test.js

// routes/projects.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import projectsRouter from './projects.js'; 

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
  app.use('/api/v1', projectsRouter);
});

describe('GET /projects', () => {
  it('should return user projects', async () => {
    const res = await request(app).get('/api/v1/projects');
    console.log(res.body);
    expect(res.statusCode).toBe(200);
  });
});
