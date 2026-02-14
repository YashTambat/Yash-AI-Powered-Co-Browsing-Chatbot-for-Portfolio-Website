import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'education', name: 'Education History', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
    { id: 'contact', name: 'Contact Me', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 z-40 flex items-center justify-between px-4">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">A</div>
            <span className="font-bold text-lg">Alex.dev</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
         </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 z-30 animate-in slide-in-from-top-2">
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { onTabChange(item.id); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl ${isSidebarOpen ? 'w-72' : 'w-20'} flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent truncate tracking-tight">Portfolio Pro</h1>}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h16M4 18h7"} />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'}`}
            >
              <svg className={`w-6 h-6 min-w-[24px] ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {isSidebarOpen && <span className="ml-4 font-medium whitespace-nowrap">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            {isSidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">A</div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-200 truncate">Alex</p>
                  <p className="text-xs text-slate-500 truncate">Computer Science</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white mx-auto shadow-md">A</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative pt-16 md:pt-0">
        {/* Header (Desktop Only) */}
        <header className="hidden md:flex h-16 border-b border-slate-800 items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 w-full">
          <h2 className="text-lg font-semibold text-slate-100 capitalize flex items-center gap-3">
            {activeTab === 'dashboard' ? 'Portfolio Dashboard' : activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Active</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 relative scroll-smooth">
           {/* Background Gradients */}
           <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
           <div className="relative z-0">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
