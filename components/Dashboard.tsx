import React from 'react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, setActiveTab }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section id="hero" className="relative p-8 md:p-12 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] md:rounded-[3rem] overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/10 blur-[100px] md:blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-tight">
            Expert Full-Stack Solutions.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            BE Computer Science graduate with a 9.02 CGPA. Deeply specialized in AIML, MERN, and React Native development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              id="hero-view-projects" 
              onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })} 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95"
            >
              View Projects
            </button>
            <button 
              onClick={() => setActiveTab('education')} 
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl font-bold text-white transition-all border border-slate-700 backdrop-blur-sm hover:border-slate-600"
            >
              Education Info
            </button>
          </div>
        </div>
      </section>

      <section id="projects-section" className="space-y-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Project Portfolio</h2>
            <div className="h-px flex-1 bg-slate-800 ml-6 hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} id={proj.id} className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all flex flex-col h-full hover:bg-slate-900/60 shadow-lg hover:shadow-indigo-500/10">
              <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">{proj.category}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{proj.title}</h3>
              <p className="text-slate-400 text-sm flex-1 mb-6 leading-relaxed">{proj.desc}</p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/50">
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
};

export default Dashboard;
