import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store';
import { getChatResponse } from '../lib/openai';

export const Chat: React.FC = () => {
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage(input, 'user');
    setInput('');
    
    // Start AI processing
    setTyping(true);
    
    // Prepare message history for context
    const messageHistory = messages.map(({ role, content }) => ({
      role,
      content
    }));

    // Get AI response
    const response = await getChatResponse(input, messageHistory);
    
    // Add AI response
    addMessage(response, 'assistant');
    setTyping(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-end">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="תאר/י את הבעיה הרפואית שלך..."
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            dir="rtl"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};