import React, { useRef, useEffect } from 'react';
import { AppStatus, ChatMessage } from '../types';

// ChatBot Component

interface ChatBotProps {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  position: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  messages: ChatMessage[];
  status: AppStatus;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({
  isChatOpen,
  setIsChatOpen,
  position,
  handleMouseDown,
  messages,
  status,
  inputValue,
  setInputValue,
  handleSendMessage
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      style={isChatOpen ? { 
        position: 'fixed',
        left: (position.x !== 0 || position.y !== 0) ? position.x : undefined,
        top: (position.x !== 0 || position.y !== 0) ? position.y : undefined,
        bottom: (position.x !== 0 || position.y !== 0) ? undefined : '1.5rem',
        right: (position.x !== 0 || position.y !== 0) ? undefined : '1.5rem',
      } : { position: 'fixed', bottom: '1.5rem', right: '1.5rem' }}
      className={`fixed z-50 flex flex-col items-end ${isChatOpen ? 'w-[90vw] md:w-[400px]' : 'w-16'} transition-all duration-300` }
    >
      {isChatOpen && (
        <div className="w-full h-[500px] md:h-[450px] max-h-[65vh] bg-slate-900/98 backdrop-blur-3xl border border-slate-700/50 rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          <div onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} className="p-5 md:p-7 border-b border-slate-800 flex items-center justify-between bg-indigo-600/10 cursor-grab active:cursor-grabbing select-none touch-none">
            <div className="flex items-center space-x-3 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div><h3 className="font-bold text-white text-base">Alex's Assistant</h3><div className="flex items-center space-x-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span><span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Intelligent & Aware</span></div></div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-7 space-y-5 scroll-smooth custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center p-6 space-y-6">
                <p className="text-slate-400 text-sm leading-relaxed font-medium">I'm your intelligent guide. Ask me for specific data about Alex's academic history or projects!</p>
                <div className="flex flex-col gap-3">
                    {["Tell me my 10th grade percentage", "How many React Native projects are there?", "What was my CGPA in BE?", "Show me the MERN stack projects"].map(hint => (
                        <button key={hint} onClick={() => setInputValue(hint)} className="text-[11px] text-left px-4 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:bg-indigo-600/10 hover:border-indigo-500/40 transition-all text-slate-300 font-semibold shadow-sm">
                            {hint}
                        </button>
                    ))}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-5 rounded-[2rem] ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10' : 'bg-slate-800/95 text-slate-100 rounded-tl-none border border-slate-700/50 shadow-md'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {status === AppStatus.LOADING && (
              <div className="flex justify-start px-2"><div className="flex space-x-2 animate-pulse items-center bg-slate-800/40 px-5 py-3 rounded-2xl border border-slate-700/20"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div><div className="w-2 h-2 bg-indigo-500 rounded-full delay-75"></div><div className="w-2 h-2 bg-indigo-500 rounded-full delay-150"></div></div></div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-6 border-t border-slate-800 bg-slate-950/40">
            <div className="relative group">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask me about Alex's grades or projects..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 pr-16 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600" />
              <button onClick={handleSendMessage} className="absolute right-2.5 top-2.5 p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all shadow-xl shadow-indigo-600/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7V7l9 7-9 7v-5z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 group relative">
         <div className="absolute inset-0 rounded-3xl bg-indigo-600 animate-ping opacity-20"></div>
         {isChatOpen ? <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
      </button>
    </div>
  );
};

export default ChatBot;
