export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export type ChatState = {
  messages: Message[];
  isTyping: boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setTyping: (typing: boolean) => void;
};