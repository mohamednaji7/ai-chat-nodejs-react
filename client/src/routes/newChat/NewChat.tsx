import './newChat.css';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE } from '../../utils/api';
import ChatInput from '../../components/ChatInput/ChatInput';
import supabase from '../../utils/supabase';

const NewChat = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (message: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }
    const response = await fetch(`${API_BASE}/api/v1/chat`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: message.substring(0, 37)
      })
    });

    if(response.ok){
      const newChat = await response.json();
  
      queryClient.setQueryData(['userChats'], (oldData: any) => {
        return oldData ? [newChat, ...oldData] : [newChat];
      });
      
      queryClient.setQueryData(['pendingPrompt', newChat._id], message);
      navigate(`/chat/${newChat._id}`);
    }
    else if(response.status === 401){
      alert('Session expired. Please log in again.');
      await supabase.auth.signOut();
      navigate('/')
    }
    else {
      await supabase.auth.signOut();
      alert('An error occurred. Please try again.');
      // log the error
      console.error('Error creating chat:', response.statusText);
      navigate('/')
    }
  };

  return (
    <div className='newChat'>
      <ChatInput onSubmit={handleSubmit} placeholder="Start chatting..." />
    </div>
  );
};

export default NewChat;