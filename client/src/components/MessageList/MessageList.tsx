import './messageList.css';
import { RefObject } from 'react';
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { updateMessageReaction } from '../../utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Circle } from "lucide-react";
import { useFileMentionProcessor } from './FileMentionProcessor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  _id: string;
  role: string;
  content: string;
  reaction: 'UP' | 'DOWN' | 'NONE';
}

interface MessageListProps {
  isStreaming: boolean;
  chatId: string;
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  endRef: RefObject<HTMLDivElement>;
}

const MessageList = ({ isStreaming, chatId, messages, isLoading, error, endRef }: MessageListProps) => {
  const queryClient = useQueryClient();
  const { renderMessageContent } = useFileMentionProcessor();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">An error has occurred: {error.message}</div>;

  const handleFeedback = (messageId: string, feedback: 'UP' | 'DOWN' | 'NONE') => {
    console.log('handleFeedback');
    console.log(`Message ${messageId} received ${feedback} feedback`);
    updateMessageReaction(chatId, messageId, feedback);

    queryClient.setQueryData(['chat', chatId], (oldData: Message[]) => {
      const updatedMessages = oldData.map((msg) => {
        if (msg._id === messageId) {
          return { ...msg, reaction: feedback };
        }
        return msg;
      });
      return updatedMessages;
    });
  };

  // Enhanced content renderer that supports markdown tables
  const renderEnhancedMessageContent = (content: string) => {
    // Check if content contains table syntax (basic detection)
    const hasTable = content.includes('|') && content.includes('---');
    
    if (hasTable) {
      // Render as markdown with table support
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      );
    } else {
      // Use existing file mention processor for other content
      return renderMessageContent(content);
    }
  };

  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div className={`message ${msg.role}`} key={msg._id}>
          {renderEnhancedMessageContent(msg.content)}
          
          {msg.role === 'assistant' && (
            <>
              {isStreaming && index === messages.length - 1 ? (
                <div className="streaming-indicator">
                  <Circle 
                    className="streaming-icon" 
                    size={16} 
                    strokeWidth={1.5} 
                    fill="currentColor" 
                  />
                </div>
              ) : (
                <div className="feedback-buttons">
                  <button 
                    className={`feedback-btn ${msg.reaction === 'UP' ? 'reaction-active' : ''}`}
                    onClick={() => handleFeedback(msg._id, msg.reaction === 'UP' ? 'NONE' : 'UP')}
                    aria-label="Thumbs up"
                  >
                    <ThumbsUp 
                      className={`feedback-icon ${msg.reaction === 'UP' ? 'feedback-icon-active' : ''}`}
                      fill={msg.reaction === 'UP' ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                  <button 
                    className={`feedback-btn ${msg.reaction === 'DOWN' ? 'reaction-active' : ''}`}
                    onClick={() => handleFeedback(msg._id, msg.reaction === 'DOWN' ? 'NONE' : 'DOWN')}
                    aria-label="Thumbs down"
                  >
                    <ThumbsDown 
                      className={`feedback-icon ${msg.reaction === 'DOWN' ? 'feedback-icon-active' : ''}`}
                      fill={msg.reaction === 'DOWN' ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      <div className="endOfMsgs" ref={endRef}></div>
    </div>
  );
};

export default MessageList;
