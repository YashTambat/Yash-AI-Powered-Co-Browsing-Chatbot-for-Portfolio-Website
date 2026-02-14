import React from 'react';

interface ContactProps {
  formValues: { name: string; email: string; message: string };
  setFormValues: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
  formSubmitted: boolean;
  setFormSubmitted: (submitted: boolean) => void;
}

const Contact: React.FC<ContactProps> = ({ formValues, setFormValues, formSubmitted, setFormSubmitted }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {formSubmitted ? (
          <div className="text-center py-10 animate-in fade-in zoom-in relative z-10">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-slate-400">Thanks {formValues.name}, I'll get back to you soon.</p>
            <button 
              onClick={() => setFormSubmitted(false)} 
              className="mt-8 px-8 py-3 bg-slate-800 rounded-xl text-indigo-400 font-bold hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              Send Another
            </button>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 text-white">Inquiry Form</h2>
              <p className="text-slate-500">I'm currently accepting new projects.</p>
            </div>
            
            <div className="space-y-4">
              <div className="group">
                <input 
                  id="form-name" 
                  type="text" 
                  placeholder="Full Name" 
                  value={formValues.name} 
                  onChange={(e) => setFormValues({...formValues, name: e.target.value})} 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-700 text-white group-hover:border-slate-700" 
                />
              </div>
              <div className="group">
                <input 
                  id="form-email" 
                  type="email" 
                  placeholder="Email Address" 
                  value={formValues.email} 
                  onChange={(e) => setFormValues({...formValues, email: e.target.value})} 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-700 text-white group-hover:border-slate-700" 
                />
              </div>
              <div className="group">
                <textarea 
                  id="form-message" 
                  rows={4} 
                  placeholder="Your Message" 
                  value={formValues.message} 
                  onChange={(e) => setFormValues({...formValues, message: e.target.value})} 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none placeholder:text-slate-700 text-white group-hover:border-slate-700" 
                />
              </div>
            </div>

            <button 
              id="submit-btn" 
              onClick={() => setFormSubmitted(true)} 
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-2xl font-bold text-lg text-white transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              Send Inquiry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
