import SupabaseClient from '../SupabaseClient.js';

const ProfileService = {
 
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
      // .neq('purpose', 'TEST')
      // .neq('status', 'archived')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

};


export default ProfileService