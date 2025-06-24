// src/components/newPrompt/NewPromptSteam.tsx

import { useEffect, useRef } from 'react';
import './newPrompt.css'
import { useLocation } from 'react-router-dom'
import { useChatStream } from '../../hooks/useChatStream';
import ChatInput from '../ChatInput/ChatInput';

interface NewPromptProps {
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
}


const NewPromptStream = ({isStreaming, setIsStreaming}: NewPromptProps)  => {
  const path = useLocation().pathname
  const chatId = path.split('/').pop()

  if (!chatId) {
    return <div>Invalid chat ID</div>
  }

  
  const endRef = useRef<HTMLDivElement>(null);
  const { mutation, checkPendingPrompt } = useChatStream(chatId, isStreaming, setIsStreaming);

  // Handle initial message from NewChat
  // Check for pending prompts from NewChat
  useEffect(() => {
    checkPendingPrompt();
  }, [chatId, checkPendingPrompt]);
  const handleSubmit = async (message: string) => {

    if (isStreaming) return;
    mutation.mutate(message);


  };


  return (
    <>
      <div className='endChat' ref={endRef}></div>
      <ChatInput 
        onSubmit={handleSubmit}
        isDisabled={isStreaming}
        placeholder="Type a message..."
        formContainerClass="newPrompt"
      />

    </>
  );
};

export default NewPromptStream;