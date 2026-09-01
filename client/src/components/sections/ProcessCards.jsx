import React from 'react';
import { UserCheck, BookOpen, Building } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Screen & Select',
    icon: UserCheck,
    description: 'We evaluate candidates based on foundational aptitude, communication, and career aspirations.',
  },
  {
    step: '02',
    title: 'Train & Upskill',
    icon: BookOpen,
    description: 'Intensive corporate simulation bootcamps focusing on real business operations, client pitches, and tools.',
  },
  {
    step: '03',
    title: 'Deploy & Hire',
    icon: Building,
    description: 'Pre-vetted, day-one productive candidates are deployed to partner corporate teams with zero hiring friction.',
  },
];

export default function ProcessCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 relative group"
            data-aos="fade-up"
            data-aos-delay={idx * 150}
          >
            <span className="text-4xl font-black text-slate-100 group-hover:text-indigo-50 transition absolute top-6 right-6">
              {item.step}
            </span>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-inner">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
