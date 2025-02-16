import { create } from 'zustand';
import { ChatState } from './types';

export const useChatStore = create<ChatState>((set) => ({
  messages: [{
    id: '1',
    content: 'שלום, אני כאן כדי לעזור לך. איך אני יכול/ה לסייע לך היום?',
    role: 'assistant',
    timestamp: new Date()
  }],
  isTyping: false,
  addMessage: (content: string, role: 'user' | 'assistant') =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(36).substring(7),
          content,
          role,
          timestamp: new Date()
        }
      ]
    })),
  setTyping: (typing: boolean) => set({ isTyping: typing })
}));