export interface ChatMessageI {
    _id: string;
    role: 'user' | 'assistant';
    content: string;
  }