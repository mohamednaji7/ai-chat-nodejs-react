// src/services/Database/Project.js

import SupabaseClient from '../SupabaseClient.js';

const ProjectService = {
  async getProjectChats(userId, project_id) {
    // console.log('getProjectChats')
    // console.log(userId)
    // console.log(project_id)
    const { data, error } = await SupabaseClient
      .from('chat')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', project_id)
      // .neq('purpose', 'TEST')
      // .neq('status', 'archived')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  }
  ,
  // Add message to chat history
  async addFile(project_id, name, content ) {
    const { data, error } = await SupabaseClient
      .from('file')
      .insert({
        project_id,
        name,
        content,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProjectFiles(project_id) {
    const { data, error } = await SupabaseClient
      .from('file')
      .select('*')
      .eq('project_id', project_id)
      .order('name', { ascending: true });

    if (error) throw error;
    return data
  }
  ,
  async getProjectFile(file_id) {
    const { data, error } = await SupabaseClient
      .from('file')
      .select('*')
      .eq('_id', file_id);
    if (error) throw error;
    return data[0];
  }
  , 
  async getUserProjects(user_id){
    const {data, error} = await SupabaseClient
      .from('project')
      .select('_id, name, number')
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false })
    if (error) throw error;
    return data;
  }
  ,
  async createProject(user_id, name) {
    const { data, error } = await SupabaseClient
      .from('project')
      .insert({
        user_id,
        name,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
export default ProjectService