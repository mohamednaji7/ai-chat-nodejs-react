import express from 'express';
import streamChatCompletion from '../services/AI/ChatCompletion.js';
import axios from 'axios';

const router = express.Router();

// Facebook/WhatsApp webhook verification
router.get('/', (req, res) => {
    console.log('WhatsApp webhook GET request received:', req.query);
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    if (!VERIFY_TOKEN) {
        console.error('WHATSAPP_VERIFY_TOKEN is not defined');
        res.status(500).send('WHATSAPP_VERIFY_TOKEN is not defined');
        return;
    }
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    console.log('Mode:', mode, 'Token:', token, 'Challenge:', challenge);
    console.log('Expected Token:', VERIFY_TOKEN);
    if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Verification successful, sending challenge:', challenge);
        return res.status(200).send(challenge);
    } else {
        console.log('Verification failed');
        return res.sendStatus(403);
    }
});

// Handle incoming WhatsApp messages
router.post('/', async (req, res) => {
    console.log('WhatsApp webhook POST request received:', req.body);
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const messages = changes?.value?.messages;
        if (!messages || messages.length === 0) {
            console.log('No messages to process');
            return res.sendStatus(200);
        }
        const msg = messages[0];
        const userPhone = msg.from;
        const userText = msg.text?.body;
        console.log('Message from:', userPhone, 'Text:', userText);
        const user = {
            user_metadata: {
                full_name: userPhone,
                email: `${userPhone}@whatsapp.fake`
            },
            loggingname: userPhone
        };
        const chatId = userPhone;
        // const agentResponse = await streamChatCompletion(chatId, userText, user, null);
        // lets echo for testing 
        const agentResponse = `echo: ${userText}`;
        console.log('Agent response:', agentResponse);
        await sendWhatsappMessage(userPhone, agentResponse);
        return res.sendStatus(200);
    } catch (err) {
        console.error('Error handling WhatsApp webhook:', err);
        return res.sendStatus(500);
    }
});

// Helper to send a WhatsApp message via Cloud API
async function sendWhatsappMessage(to, message) {
    const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneNumberId) {
        console.error('WhatsApp API credentials missing');
        throw new Error('WHATSAPP_CLOUD_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not defined');
    }
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    try {
        await axios.post(url, {
            messaging_product: 'whatsapp',
            to,
            text: { body: message }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('WhatsApp message sent to:', to);
    } catch (err) {
        console.error('Failed to send WhatsApp message:', err.response?.data || err.message);
    }
}

export default router;