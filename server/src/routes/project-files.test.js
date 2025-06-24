// src/routes/project-files.test.js

// routes/projects.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import router from './project-files.js';
import Project from '../services/Database/Project.js';

let app;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use('/api/v1', router);
});

describe('GET /project-files', () => {
  it('should return all files for a project', async () => {

    const res = await request(app).get('/api/v1/project-files').query({ project_id});
    // console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Check if response is an array
    res.body.forEach((file) => {
      expect(file).toBeInstanceOf(Object); // Each item is an object
      expect(file).toHaveProperty('_id'); // Has 'id' property
      expect(file).toHaveProperty('name'); // Has 'name' property
      expect(file).toHaveProperty('content'); // Has 'name' property
      expect(typeof file._id).toBe('string'); // id is a string
      expect(typeof file.name).toBe('string'); // name is a string
      expect(typeof file.content).toBe('string'); // name is a string
    });
  });

  it('should return a single file when file_id is provided', async () => {
    const res = await request(app).get('/api/v1/project-files').query({ project_id , file_id});
    // console.log(res.body);
    expect(res.statusCode).toBe(200);
    const file = res.body
    expect(file).toBeInstanceOf(Object); // Check if response is an object
    expect(file).toBeInstanceOf(Object); // Each item is an object
    expect(file).toHaveProperty('_id'); // Has 'id' property
    expect(file).toHaveProperty('name'); // Has 'name' property
    expect(file).toHaveProperty('content'); // Has 'name' property
    expect(typeof file._id).toBe('string'); // id is a string
    expect(typeof file.name).toBe('string'); // name is a string
    expect(typeof file.content).toBe('string'); // name is a string
  });

  it('should return 400 if project_id is missing', async () => {
    const res = await request(app).get('/api/v1/project-files');
    console.log(res.text)
    expect(res.statusCode).toBe(400);
  });

  it('should return 500 on internal error', async () => {
    vi.spyOn(Project, 'getProjectFiles').mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/v1/project-files').query({ project_id: '123' });
    console.log(res.text)
    expect(res.statusCode).toBe(500);
  });
});
