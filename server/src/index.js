// ********************************************************************************
// IMPORT

import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


import chatRouter from './routes/chatRouter.js'
import chatsRouter from './routes/chatsRouter.js'
import historyRouter from './routes/historyRouter.js'
import generateTitleRouter from './routes/generateTitleGeminiRouter.js'
import reactionRouter from './routes/reactionRouter.js'
// import promptRouter from './routes/promptOpenaiRouter.js'
// import promptStreamRouter from './routes/promptStreamOpenaiRouter.js';
import promptRouter from './routes/promptGeminiRouter.js'
import promptStreamRouter from './routes/promptStreamGeminiRouter.js';


// Import middleware
import  authenticateToken from './middleware/authenticateToken.js';

// ********************************************************************************


const PORT = process.env.PORT;
console.log(`PORT: ${PORT}`);



// ********************************************************************************
// TESTS

// import supabaseAppTest from './tests/supabaseAppTest.js'
// supabaseAppTest();

// ********************************************************************************
// INIT
const app = express();



app.use(
    cors({
        origin: [
            process.env.CLIENT_ORIGIN
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
app.use('/api/v1',authenticateToken, promptRouter);
app.use('/api/v1',authenticateToken, promptStreamRouter);
app.use('/api/v1',authenticateToken, generateTitleRouter);
app.use('/api/v1',authenticateToken, reactionRouter);



// ********************************************************************************
// // Add this after the other middleware configurations
// app.use((req, res, next) => {
//     res.setHeader(
//         'Content-Security-Policy',
//         "default-src 'self'; " +
//         "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.com; " +
//         "style-src 'self' 'unsafe-inline' https://clerk.com https://*.clerk.com; " +
//       "frame-src 'self' https://clerk.com https://*.clerk.com; " +
//       "img-src 'self' data: https://clerk.com https://*.clerk.com; " +
//       "connect-src 'self' https://clerk.com https://*.clerk.com;"
//     );
//     next();
// });

// Serve Static 
import path from 'path'
import { fileURLToPath } from 'url';

// Get the __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../client/build')))
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'))
})

// ********************************************************************************
// LISTEN
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});


