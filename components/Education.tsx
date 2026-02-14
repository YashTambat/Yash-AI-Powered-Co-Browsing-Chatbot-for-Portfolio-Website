import React from 'react';
import { Education as EducationType } from '../types';

interface EducationProps {
  educationHistory: EducationType[];
}

const Education: React.FC<EducationProps> = ({ educationHistory }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Academic Background</h2>
        <p className="text-slate-500 max-w-xl mx-auto">A track record of excellence from secondary school to university graduation.</p>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        {educationHistory.map((edu, idx) => (
          <div key={edu.id} id={edu.id} className="relative bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row gap-6 md:gap-8 items-start group hover:border-indigo-500/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-indigo-500/5">
            <div className="hidden md:flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                {educationHistory.length - idx}
              </div>
              {idx !== educationHistory.length - 1 && <div className="w-0.5 h-24 bg-slate-800 mt-4 group-hover:bg-indigo-500/30 transition-colors"></div>}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">{edu.degree}</h3>
                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black shadow-lg shadow-indigo-600/20 self-start md:self-auto">{edu.passout}</span>
              </div>
              <h4 className="text-indigo-400 font-semibold text-lg mb-2">{edu.institution}</h4>
              <p className="text-slate-500 mb-6 font-medium leading-relaxed">{edu.details}</p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800 min-w-[140px] group-hover:border-indigo-500/20 transition-colors">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold mb-1">Performance</span>
                  <span className="text-emerald-400 font-bold">{edu.score}</span>
                </div>
                {edu.board && (
                  <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800 min-w-[140px] group-hover:border-indigo-500/20 transition-colors">
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
};

export default Education;
