import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, X, Minimize2, Maximize2, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, UserRole } from '../types';
import { useAuth } from '../lib/auth';

export const AIChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Hello ${user?.name}! I'm your Taleem360 AI assistant. How can I help you manage your school today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only show for Admins and Super Admins
  if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPER_ADMIN) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the provided key as a fallback if the environment variable is missing
      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAYtZocTPfSdCQ8T3brgMwV7YVIAQd_Eck";
      console.debug('[AIChatbot] Initializing with API Key:', apiKey.substring(0, 8) + '...');
      
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `
        You are Taleem360 AI, a specialized assistant for school administrators using the Taleem360 School ERP.
        Your goal is to help admins with:
        1. Navigating the platform (Students, Staff, Classes, Finance, Examination, Timetable).
        2. Providing best practices for school management.
        3. Answering technical questions about the ERP features.
        4. Analyzing school data (hypothetically, based on what the user tells you).
        
        The current user is ${user?.name}, role: ${user?.role}.
        Keep your responses professional, concise, and helpful.
        If you don't know something specific about their school's private data, ask them to provide context or check the relevant module.
      `;

      // Gemini multi-turn chat MUST start with a 'user' message.
      // Our first message is a 'model' greeting, so we skip it in the history
      // or ensure the first message sent to the API is from the user.
      const history = messages
        .filter((m, index) => index > 0) // Skip the initial greeting
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await ai.models.generateContent({
        model,
        contents: [...history, { role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('[AIChatbot] API Error:', error);
      
      // Extract detailed error message if available
      let errorText = "I'm having trouble connecting right now. Please try again in a moment.";
      if (error?.message) {
        errorText = `Error: ${error.message}`;
      }
      if (error?.response?.data?.detail) {
        errorText = `Error: ${error.response.data.detail}`;
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center justify-center group"
        >
          <Sparkles className="w-6 h-6 mr-2 group-hover:animate-pulse" />
          <span className="font-semibold">AI Assistant</span>
        </button>
      ) : (
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ${
          isMinimized ? 'h-16 w-72' : 'h-[500px] w-96'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 rounded-t-2xl text-white">
            <div className="flex items-center">
              <div className="bg-white/20 p-1.5 rounded-lg mr-3">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Taleem360 AI</h3>
                {!isMinimized && <p className="text-[10px] text-indigo-100">Online & Ready to help</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/10 p-1 rounded transition-colors">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        msg.role === 'user' ? 'bg-indigo-100 text-indigo-600 ml-2' : 'bg-white border border-gray-200 text-indigo-600 mr-2'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Powered by Google Gemini AI
                </p>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
