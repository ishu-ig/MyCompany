import React from 'react';

export default function PageHeader({ badge, title, description }) {
  return (
    <div className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 opacity-90" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
        {badge && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3.5 py-1.5 rounded-full border border-indigo-700/50 mb-4">
            {badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" data-aos="fade-up">
          {title}
        </h1>
        {description && (
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
