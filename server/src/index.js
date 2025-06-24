// src/index.js

// src/index.js
import app from './app.js';
import express from 'express';


import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT || 3000;

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


