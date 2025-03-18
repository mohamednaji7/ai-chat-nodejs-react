import dotenv from 'dotenv';
import { accountService, chatService } from '../services/supabaseApp.js'

dotenv.config();

async function supabaseAppTest() {
  try {
    // Dummy user data
    const dummyUsername = 'testuser';
    const dummyDisplayName = 'Test User';
    const userId = '005ed9f7-e0a5-459f-913f-a717ba6a9519'


    try{
      // Create a new user profile
      const userProfile = await accountService.createUserProfile(userId, dummyUsername, dummyDisplayName);
      console.log('[accountService] [createUserProfile]')
      console.log('User Profile Created:', userProfile);
    }catch{
      // Get the user profile
      const userProfile = await accountService.getUserProfile(userId);
      console.log('[accountService] [getUserProfile]')
      console.log('Get User Profile:', userProfile);
    }

  
    
    // Get the user chats
    console.log('[accountService] [getUserChats]')
    const userChats = await accountService.getUserChats(userId);
    console.log('User Chats:', userChats);


    // Create a new chat
    console.log('[chatService] [createChat]')
    const userChat = await chatService.createChat(userId, "New Chat", "default-model");
    console.log('Chat Created:', userChat);

    // Add messages
    console.log('[chatService] [addMessage]')
    await chatService.addMessage(userChat._id, "user", "Hello!");
    console.log('User Message Added');
    await chatService.addMessage(userChat._id, "assistant", "Hi there!");
    console.log('Assistant Message Added');

    // Get chat history
    console.log('[chatService] [getChatHistory]')
    const history = await chatService.getChatHistory(userChat._id);
    console.log('Chat History:', history);

  } catch (error) {
    console.error('Error during tests:', error.message);
  }
}

export default supabaseAppTest
