// src/app.js

import helmet from 'helmet';

// ********************************************************************************
// IMPORT

import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


import chatRouter from './routes/chat.js'
import chatsRouter from './routes/chats.js'
import historyRouter from './routes/history.js'
import generateTitleRouter from './routes/generateTitle.js'
import reactionRouter from './routes/reaction.js'

import projectsRouter from './routes/projects.js'
import projectRouter from './routes/project.js'
import projectFilesRouter from './routes/project-files.js'

import promptStreamRouter from './routes/promptStream.js';




// Import middleware
import  authenticateToken from './middleware/authenticateToken.js';


// ********************************************************************************
// CONFIG
import dotenv from 'dotenv';
dotenv.config();



// ********************************************************************************
// INIT
const app = express();
// ✅ Best: Place helmet here
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      connectSrc: ["'self'", "https://*.supabase.co"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));


app.use(
    cors({
        origin: [
                process.env.CLIENT_ORIGIN,
            ], // Explicit origins
        credentials: true, // Enable credentials
        methods: ['GET', 'POST'], // Specify allowed methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    })
);

app.use(express.json());

app.use(morgan('dev'));
app.use(cookieParser());


// ********************************************************************************

// CONNECTIVITY ROUTES 
app.get('/api/v1/alive', (req, res) => {
    res.send(`Hello from the backend! Timestamp: ${Date.now()}`);
});
 
// Protected route example
app.get('/api/v1/alive-protected', authenticateToken, (req, res) => {
    res.send(`This is a protected endpoint.`);
  });

// Protected route example
app.get('/api/v1/alive-protected-user', authenticateToken,  (req, res) => {
    res.send(`Hello ${req.user.user_metadata.email}! This is a protected endpoint.`);
  });




// Protected routes - add requireAuth middleware

// Protected routes 
app.use('/api/v1',authenticateToken, chatRouter);
app.use('/api/v1',authenticateToken, chatsRouter);
app.use('/api/v1',authenticateToken, historyRouter);
app.use('/api/v1',authenticateToken, promptStreamRouter);
app.use('/api/v1',authenticateToken, generateTitleRouter);
app.use('/api/v1',authenticateToken, reactionRouter);
app.use('/api/v1',authenticateToken, projectRouter);
app.use('/api/v1',authenticateToken, projectsRouter);
app.use('/api/v1',authenticateToken, projectFilesRouter);



export default app;