// src/services/Database/ChatService.js

import SupabaseClient from '../SupabaseClient.js';

const ChatService = {

  // Create a new chat
  async createChat(userId, project_id, title, modelName) {
    const { data, error } = await SupabaseClient
      .from('chat')
      .insert({
        user_id: userId,
        project_id,
        title,
        model_name: modelName,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // update chat title
  async updateChatTitle(chatId, title) {
    const { data, error } = await SupabaseClient
      .from('chat')
      .update({
        title,
      })
      .eq('_id', chatId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  // update chat title


  // Add message to chat history
  async addMessage(chat_id, role, content) {
    const { data, error } = await SupabaseClient
      .from('message')
      .insert({
        chat_id,
        role,
        content,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async addMessageJSONB(chat_id, role, message, is_ui_message=false) {
    // message is a JSON object or array you want to save in the 'message' column

    const { data, error } = await SupabaseClient
      .from('message')
      .insert({ 
        chat_id,
        role,
        message,
        is_ui_message
      })     // replace the message column with this JSON
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  ,
  // Get chat history with reactions
   
  
  async getChatHistoryforUI(chatId) {
    const { data, error } = await SupabaseClient
      .from('message')
      .select(`
        _id, chat_id, role, content, tokens_used, created_at,
        reaction(value)
      `)
      .eq('chat_id', chatId)
      .eq('is_ui_message', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Ensure reaction is properly extracted from the nested object
    return data.map(msg => ({
      ...msg,
      reaction: msg.reaction?.value || 'NONE', // If no reaction, set to null
    }));
  },
  
  async getChatHistory(chatId) {
    const { data, error } = await SupabaseClient
      .from('message')
      .select('role, content, message, is_ui_message')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data
  },
  

    // Update message reaction in the reaction table
    async updateMessageReaction(messageId, reaction) {
      console.log(`[ChatService] [updateMessageReaction] [${messageId}] [${reaction}]`);
  
      const { data, error } = await SupabaseClient
        .from('reaction')
        .upsert(
          { message_id: messageId, value: reaction }, 
          { onConflict: ['message_id'] } // Ensures update if exists, insert if not
        )
        .select()
        .single();
  
      if (error) throw error;
      return data;
    },

  // Get all chats for a user

};
export default ChatService