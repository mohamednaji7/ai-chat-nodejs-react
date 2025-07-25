// src/services/Auth/AuthService.js

import SupabaseClient from '../SupabaseClient.js';
import {isAdmin} from './data.js';

const AuthService = {

  // Get all chats for a user
  async authorizeUserChat(userId, threadId) {
    if (isAdmin(userId)) {
      return true;
    }
    const { data, error } = await SupabaseClient
      .from('chat')
      .select('_id')
      .eq('user_id', userId)
      // .neq('purpose', 'TEST')
      // .neq('status', 'archived')
      .order('updated_at', { ascending: false });
    if (error) throw error;

    let found = false;
    data.forEach((thread) => {
      if (thread._id == threadId) {
        found = true;
      }
    });
    return found;

  },
  async authorizeThreadMsg(threadName, msgId) {
    const { data, error } = await SupabaseClient
      .from('thread_message')
      .select('_id')
      .eq('thread_name', threadName)
      .order('updated_at', { ascending: false });
    if (error) throw error;

    let found = false;
    data.forEach((msg) => {
      if (msg._id == msgId) {
        found = true;
      }
    });

    return found;

  },

};


export default AuthService