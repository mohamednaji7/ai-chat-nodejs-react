import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_BASE } from '../../utils/api';
import MessageList from '../../components/MessageList/MessageList';
import NewPrompt from '../../components/newPrompt/NewPromptSteam';
import './chat.css';
import { useState } from 'react';

const Chat = () => {
  const path = useLocation().pathname;
  const chatId = path.split('/').pop();
  const endRef = useRef<HTMLDivElement>(null!);
  const navigate = useNavigate();
  const [isStreaming, setIsStreaming] = useState(false);



  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'instant' });
  };



  const { error, data, isFetching } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/v1/history/${chatId}`, {
        credentials: 'include',
      });
      if (!response.ok) {

        navigate('/');
        // throw new Error(`API [/api/v1/history] error: ${response.status}`);
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (data) {
      scrollToBottom();
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  
  if (!chatId) {
    return <div>Invalid chat ID</div>;
  }



  return (
    <div className="chat">

      <div className="wrapper">
        <MessageList
          isStreaming={isStreaming}
          chatId={chatId}
          messages={data || []}
          isLoading={isFetching}
          error={error as Error}
          endRef={endRef}
        />
      </div>
      <NewPrompt 
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
      />
    </div>
  );
};

export default Chat;