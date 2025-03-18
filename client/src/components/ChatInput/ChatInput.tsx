import { FormEvent, useRef } from 'react';
import './ChatInput.css';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  formContainerClass?: string;
  isDisabled?: boolean;  // Add this prop


}

const ChatInput = ({ 
  onSubmit, 
  formContainerClass = 'formContainer',
  placeholder = 'Type a message...', 
  isDisabled = false  // Use the prop with a default value

}
  : ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textarea = e.currentTarget.submitInput as HTMLTextAreaElement;
    const message = textarea.value.trim();
    if (!message) return;
    
    onSubmit(message);
    textarea.value = '';
    textarea.style.height = 'auto';
  };

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className={`${formContainerClass}`}>
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          name="submitInput"
          placeholder={placeholder}
          // disabled={isDisabled}  // Use the prop here
          rows={1}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
        />
        {/* <button disabled={isDisabled}>  
          <img src="/arrow.png" alt="send a message" />
        </button> */}
        
        { !isDisabled && (
          <button>
            <img src="/arrow.png" alt="send a message" />
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;