// ********************************************************************************
// IMPORT

import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


import chatRouter from './routes/chat.js'
import chatsRouter from './routes/chats.js'
import historyRouter from './routes/history.js'
import agentHistoryRouter from './routes/agentHistory.js'
import generateTitleRouter from './routes/generateTitle.js'
import reactionRouter from './routes/reaction.js'


import promptStreamRouter from './routes/promptStream.js';




// Import middleware
import  authenticateToken from './middleware/authenticateToken.js';


// ********************************************************************************
// CONFIG
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;



// ********************************************************************************
// INIT
const app = express();



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
    
    res.send('Hello from the backend!');
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

app.use('/api/v1',authenticateToken, agentHistoryRouter);




// ********************************************************************************

// Serve Static 
import path from 'path'
import { fileURLToPath } from 'url';

// Get the __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
__dirname = path.dirname(__dirname);

// app.use('/admin-dashboard', express.static(path.join(__dirname, '../admin-dashboard/build')));
// app.get('/admin-dashboard/*', requireAuth, requireAdmin,  (req, res)=>{
//     res.sendFile(path.join(__dirname, '../admin-dashboard/build', 'index.html'))
// })


app.use(express.static(path.join(__dirname, '../client/build')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'))
})

// ********************************************************************************
// LISTEN
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});


