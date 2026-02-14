import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { getAssistantResponse } from './services/gemini';
import { AppStatus, ChatMessage } from './types';
import { projects, educationHistory } from './data/portfolioData';
import Dashboard from './components/Dashboard';
import Education from './components/Education';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';

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
  
  // We keep the logic here as originally designed to calculate offset
  // We will need to assume the ChatBot component attaches a ref or we just use the event target
  // ideally we should pass a ref down, but let's stick to the current logic which uses a ref to the container.
  // Since we extracted ChatBot, we can't easily ref the container from here without forwarding ref.
  // However, looking at handleMouseDown, it uses chatRef.current.
  // A simple fix is to wrap the ChatBot component in a div here that is the draggable container? 
  // No, the chat widget IS the container.
  // Let's modify the chat logic slightly to just pass the event handler.
  // Actually, we need the ref to the element being dragged to calculate offset. 
  // Let's create a local ref and pass it to ChatBot if possible, or just manage drag here if we wrap it.
  // To minimize changes to logic, let's assume ChatBot will accept a ref? No, functional components don't default.
  // I'll wrap the ChatBot in a div that handles the positioning? 
  // NO, ChatBot HAS the fixed positioning styles.
  // BETTER APPROACH: Pass `chatRef` to ChatBot as a prop (e.g. `containerRef`) and use that.
  // NOTE: I didn't add `containerRef` to `ChatBotProps` in my previous step. I should have. 
  // But wait! `handleMouseDown` uses `chatRef.current`.
  // If I can't pass the ref easily without editing ChatBot again, I can use `e.currentTarget` in handleMouseDown 
  // to get the rect, which is actually cleaner!
  // `e.currentTarget` will refer to the element the listener is attached to.
  // Wait, `handleMouseDown` is attached to the HEADER, but we need the rect of the WHOLE CHAT window?
  // Use `e.currentTarget.parentElement` or `closest`.
  // Let's update `handleMouseDown` to be more robust without needing the ref.
  
  // actually, let's just make `handleMouseDown` take the element as an argument or uses the event.
  // The original: 
  // if (chatRef.current) { ... rect = chatRef.current.getBoundingClientRect() ... }
  // I will update handleMouseDown to use a safer approach or just ignore the ref check if I can get the target.
  
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Find the chat container - it's the parent of the header or further up
    // We can assume the drag handle is the header.
    const target = e.currentTarget as HTMLElement;
    // The container is the 2nd parent of the drag handle usually, or we can look for specific class or id.
    const container = target.closest('.fixed') as HTMLElement; 
    
    if (container) {
      setIsDragging(true);
      const rect = container.getBoundingClientRect();
      
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        let clientX, clientY;
        if ('touches' in e) {
           // Prevent scrolling while dragging on touch devices
           e.preventDefault();
           clientX = e.touches[0].clientX;
           clientY = e.touches[0].clientY;
        } else {
           clientX = (e as MouseEvent).clientX;
           clientY = (e as MouseEvent).clientY;
        }

        // Simple boundary check to keep it on screen (avoiding negative values)
        const newX = Math.max(0, Math.min(window.innerWidth - 100, clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, clientY - dragOffset.y));

        setPosition({
          x: clientX - dragOffset.x, // Allow free movement for now (or use newX/newY for constraints)
          y: clientY - dragOffset.y
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
      
      let responseText = response.text?.trim() || "";
      if (!responseText && response.candidates?.[0]?.content?.parts) {
        responseText = response.candidates[0].content.parts
          .filter(p => p.text)
          .map(p => p.text)
          .join(" ")
          .trim();
      }
      
      if (response.functionCalls) {
        await executeTools(response.functionCalls);
      }
      
      const assistantMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseText || "I've navigated to the section you're looking for. based on my records.", 
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
        content: "I'm having a bit of trouble answering right now. Try asking again!",
        timestamp: Date.now()
      }]);
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="h-full relative pb-20">
        {activeTab === 'dashboard' && <Dashboard projects={projects} setActiveTab={setActiveTab} />}
        {activeTab === 'education' && <Education educationHistory={educationHistory} />}
        {activeTab === 'contact' && (
          <Contact 
            formValues={formValues} 
            setFormValues={setFormValues} 
            formSubmitted={formSubmitted} 
            setFormSubmitted={setFormSubmitted} 
          />
        )}

        <ChatBot 
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          position={position}
          handleMouseDown={handleMouseDown}
          messages={messages}
          status={status}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </Layout>
  );
};

export default App;
