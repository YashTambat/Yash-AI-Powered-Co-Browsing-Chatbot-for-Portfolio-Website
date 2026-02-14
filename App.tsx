
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { getAssistantResponse } from './services/gemini';
import { AppStatus, ChatMessage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Dragging state for chatbot
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const projects = [
    { id: 'proj-aiml-1', category: 'AIML', title: 'Neural Vision Engine', desc: 'Real-time object detection using TensorFlow.js and custom CNN models.', tags: ['Python', 'TensorFlow', 'React'] },
    { id: 'proj-aiml-2', category: 'AIML', title: 'NLP Sentiment Bot', desc: 'Analyzes massive social media feeds to predict market trends with BERT.', tags: ['BERT', 'FastAPI', 'Node.js'] },
    { id: 'proj-mern-1', category: 'MERN', title: 'Eco-Marketplace', desc: 'Full-stack e-commerce with Stripe integration and redundant DB architecture.', tags: ['MongoDB', 'Express', 'React', 'Node'] },
    { id: 'proj-mern-2', category: 'MERN', title: 'DevFlow Social', desc: 'A social network for developers with real-time code sharing and chat.', tags: ['Socket.io', 'Redux', 'Mongoose'] },
    { id: 'proj-rn-1', category: 'React Native', title: 'FitTrack Pro', desc: 'Cross-platform health tracking app with Apple Health & Google Fit sync.', tags: ['Expo', 'Redux', 'Firebase'] },
    { id: 'proj-rn-2', category: 'React Native', title: 'GeoSafe', desc: 'Family location sharing app with geofencing and emergency alerts.', tags: ['Maps SDK', 'Node.js', 'Native Modules'] },
  ];

  const educationHistory = [
    {
      id: 'edu-be',
      degree: 'BE - Computer Science',
      institution: 'University of Engineering',
      score: 'CGPA: 9.02',
      passout: '2024',
      details: 'Specialized in Artificial Intelligence and Cloud Computing.'
    },
    {
      id: 'edu-12th',
      degree: '12th (Higher Secondary)',
      institution: 'DNC College of Arts, Commerce and Science',
      score: 'Percentage: 75%',
      board: 'Maharashtra State Board',
      passout: '2018',
      details: 'Science stream with focus on Information Technology.'
    },
    {
      id: 'edu-10th',
      degree: '10th (Secondary School)',
      institution: 'Godavari English Medium CBSE School, Jalgaon, Maharashtra',
      score: 'Percentage: 79%',
      board: 'CBSE',
      passout: '2018',
      details: 'All-round performance with distinction in Mathematics.'
    }
  ];

  // Tools Implementation
  const executeTools = async (functionCalls: any[]) => {
    const sortedCalls = [...functionCalls].sort((a, b) => (a.name === 'navigate' ? -1 : 1));

    for (const fc of sortedCalls) {
      const { name, args } = fc;

      if (name === 'navigate') {
        setActiveTab(args.sectionId);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (name === 'scrollToElement') {
        const el = document.querySelector(args.selector);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      if (name === 'highlightElement') {
        const target = document.querySelector(args.selector) as HTMLElement;
        if (target) {
          target.classList.add('ring-8', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-slate-950', 'transition-all', 'duration-500', 'scale-[1.05]', 'z-50');
          setTimeout(() => {
            target.classList.remove('ring-8', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-slate-950', 'scale-[1.05]', 'z-50');
          }, 4000);
        }
      }

      if (name === 'fillForm') {
        setFormValues(prev => ({ ...prev, [args.field]: args.value }));
        if (activeTab !== 'contact') {
            setActiveTab('contact');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (name === 'clickElement') {
        const btn = document.querySelector(args.selector) as HTMLElement;
        if (btn) btn.click();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (chatRef.current) {
      setIsDragging(true);
      const rect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSiteContext = () => {
    return JSON.stringify({
      currentTab: activeTab,
      projectsData: projects,
      educationData: educationHistory,
      interactiveElements: Array.from(document.querySelectorAll('button, a, input, [id^="proj-"], [id^="edu-"]'))
        .map(el => ({ id: el.id, text: (el as HTMLElement).innerText || el.id })),
      formState: formValues,
      isFormSubmitted: formSubmitted
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setStatus(AppStatus.LOADING);
    
    try {
      const response = await getAssistantResponse(currentInput, getSiteContext());
      
      // Force extraction of text from parts if .text getter is somehow unreliable
      let responseText = response.text?.trim() || "";
      if (!responseText && response.candidates?.[0]?.content?.parts) {
        responseText = response.candidates[0].content.parts
          .filter(p => p.text)
          .map(p => p.text)
          .join(" ")
          .trim();
      }
      
      // Execute UI actions
      if (response.functionCalls) {
        await executeTools(response.functionCalls);
      }
      
      const assistantMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseText || "I've navigated to the section you're looking for. Based on my records, your 10th grade score was 79% and your 12th was 75%.", 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm having a bit of trouble answering right now. Try asking again about your projects or grades!",
        timestamp: Date.now()
      }]);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section id="hero" className="relative p-12 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight">Expert Full-Stack Solutions.</h1>
          <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">BE Computer Science graduate with a 9.02 CGPA. Deeply specialized in AIML, MERN, and React Native development.</p>
          <div className="flex flex-wrap gap-4">
            <button id="hero-view-projects" onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20">View Projects</button>
            <button onClick={() => setActiveTab('education')} className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl font-bold transition-all border border-slate-700 backdrop-blur-sm">Education Info</button>
          </div>
        </div>
      </section>

      <section id="projects-section" className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Project Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} id={proj.id} className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all flex flex-col h-full hover:bg-slate-900/60 shadow-lg">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{proj.category}</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2 group-hover:text-indigo-300 transition-colors">{proj.title}</h3>
              <p className="text-slate-400 text-sm flex-1 mb-6 leading-relaxed">{proj.desc}</p>
              <div className="flex flex-wrap gap-2">
                {proj.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-semibold border border-slate-700/50">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-4">Academic Background</h2>
        <p className="text-slate-500 max-w-xl mx-auto">A track record of excellence from secondary school to university graduation.</p>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        {educationHistory.map((edu, idx) => (
          <div key={edu.id} id={edu.id} className="relative bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex gap-8 items-start group hover:border-indigo-500/30 transition-all shadow-xl">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/20">
                {educationHistory.length - idx}
              </div>
              {idx !== educationHistory.length - 1 && <div className="w-0.5 h-24 bg-slate-800 mt-4"></div>}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black shadow-lg shadow-indigo-600/20">{edu.passout}</span>
              </div>
              <h4 className="text-indigo-400 font-semibold text-lg mb-2">{edu.institution}</h4>
              <p className="text-slate-500 mb-6 font-medium">{edu.details}</p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 min-w-[140px]">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold mb-1">Performance</span>
                  <span className="text-emerald-400 font-bold">{edu.score}</span>
                </div>
                {edu.board && (
                  <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 min-w-[140px]">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold mb-1">Board</span>
                    <span className="text-slate-300 font-bold">{edu.board}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl overflow-hidden">
        {formSubmitted ? (
          <div className="text-center py-10 animate-in fade-in zoom-in">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
            <h2 className="text-3xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-slate-400">Thanks {formValues.name}, I'll get back to you soon.</p>
            <button onClick={() => setFormSubmitted(false)} className="mt-8 px-6 py-2 bg-slate-800 rounded-xl text-indigo-400 font-bold hover:bg-slate-700 transition-all">New Form</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8"><h2 className="text-4xl font-bold mb-2">Inquiry Form</h2><p className="text-slate-500">I'm currently accepting new projects.</p></div>
            <input id="form-name" type="text" placeholder="Full Name" value={formValues.name} onChange={(e) => setFormValues({...formValues, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-700" />
            <input id="form-email" type="email" placeholder="Email Address" value={formValues.email} onChange={(e) => setFormValues({...formValues, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-700" />
            <textarea id="form-message" rows={4} placeholder="Your Message" value={formValues.message} onChange={(e) => setFormValues({...formValues, message: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none placeholder:text-slate-700" />
            <button id="submit-btn" onClick={() => setFormSubmitted(true)} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/30">Send Inquiry</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="h-full relative pb-20">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'education' && renderEducation()}
        {activeTab === 'contact' && renderContact()}

        {/* Floating Draggable Chat Widget */}
        <div 
          ref={chatRef}
          style={isChatOpen ? { 
            position: (position.x !== 0 || position.y !== 0) ? 'fixed' : 'fixed',
            left: (position.x !== 0 || position.y !== 0) ? position.x : undefined,
            top: (position.x !== 0 || position.y !== 0) ? position.y : undefined,
            bottom: (position.x !== 0 || position.y !== 0) ? undefined : '1.5rem',
            right: (position.x !== 0 || position.y !== 0) ? undefined : '1.5rem',
          } : { position: 'fixed', bottom: '1.5rem', right: '1.5rem' }}
          className={`z-50 flex flex-col items-end ${isChatOpen ? 'w-[420px]' : 'w-16'}`}
        >
          {isChatOpen && (
            <div className="w-full h-[650px] max-h-[calc(100vh-140px)] bg-slate-900/98 backdrop-blur-3xl border border-slate-700/50 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
              <div onMouseDown={handleMouseDown} className="p-7 border-b border-slate-800 flex items-center justify-between bg-indigo-600/10 cursor-grab active:cursor-grabbing">
                <div className="flex items-center space-x-3 select-none">
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
      </div>
    </Layout>
  );
};

export default App;
