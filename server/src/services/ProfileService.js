import SupabaseClient from './SupabaseClient.js';

const ProfileService = {
  // Create a new user profile
  async createUserProfile(userId, username, email, displayName) {
    const { data, error } = await SupabaseClient
      .from('user_profile')
      .insert({ 
        _id: userId,
        email,
        username,
        display_name: displayName,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  // Get user profile
  async getUserProfile(userId){
    const {data, error} = await SupabaseClient
      .from('user_profile')
      .select('*')
      .eq('_id', userId)
      .single();
    if (error) throw error;
    return data;
  },
  // Get all chats for a user
  async getUserChats(userId) {
    const { data, error } = await SupabaseClient
      .from('chat')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

};


export default ProfileService