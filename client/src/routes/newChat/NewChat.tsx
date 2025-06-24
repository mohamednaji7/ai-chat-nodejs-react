// src/routes/newChat/NewChat.tsx

import './newChat.css';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createNewChat} from '../../utils/api';
import ChatInput from '../../components/ChatInput/ChatInput';
import supabase from '../../utils/supabase';

import { useEffect } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext'

const NewChat = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { projects, selectedProjectId, setSelectedProjectId, createProject} = useProjectContext();
  let projectId = selectedProjectId;
  // Auto-select the first project if none is selected and projects are loaded
  useEffect(() => {
    if (!selectedProjectId && projects && projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  // console.log('projectId', projectId)
  // console.log('projects', projects?.length)

  // const handleSubmit = async (message: string) => {
  //   const { data: { session } } = await supabase.auth.getSession();
  //   if (!session) {
  //     throw new Error('No active session');
  //   }
  //   const title = message.substring(0, 37)


    
  //   if (!projectId ) {
  //     if(!projects){
  //       const newProject = await createProject('Chats'); // createProject sets selectedProjectId in context AND returns new project
  //       projectId = newProject._id;  // get the new id from return value
  //     }
  //     else{
  //       alert('Please select a project')
  //       console.log(projects)
  //     }
  //   }

  const handleSubmit = async (message: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }
    const title = message.substring(0, 37)

    if (!projectId) {
      const newProject = await createProject('Chats'); // createProject sets selectedProjectId in context AND returns new project
      projectId = newProject._id;  // get the new id from return value
    }
    const newChat = await createNewChat(projectId, title);

    try{
  
      queryClient.setQueryData([selectedProjectId, 'userChats'], (oldData: any) => {
        return oldData ? [newChat, ...oldData] : [newChat];
      });
      
      queryClient.setQueryData(['pendingPrompt', newChat._id], message);
      navigate(`/chat/${newChat._id}`);
    }catch(error: any) {
      if (error.response){
        if(error.response.status === 401){
          alert('Session expired. Please log in again.');
          await supabase.auth.signOut();
          navigate('/')
        } else {
          await supabase.auth.signOut();
          alert('An error occurred. Please try again.');
          // log the error
          console.error('Error creating chat:', error.response.statusText);
          navigate('/')
        }
      }
      else{
        console.error('Error creating chat:', error.message || error );
      }
    }
    

  };

  return (
    <div className='newChat'>
      <ChatInput onSubmit={handleSubmit} placeholder="Start chatting..." />
    </div>
  );
};

export default NewChat;