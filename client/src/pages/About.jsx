import React from 'react';
import { useSelector } from 'react-redux';
import { Target, ShieldCheck, Award, Quote } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import ProcessCards from '../components/sections/ProcessCards';

const iconMap = {
  Target: Target,
  ShieldCheck: ShieldCheck,
  Award: Award,
};

export default function About() {
  const { founder, mission, pillars, metrics } = useSelector((state) => state.about);

  return (
    <div className="space-y-20 pb-20">
      <PageHeader
        badge="About TalentNestro"
        title={mission.title}
        description={mission.description}
      />

      {/* Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">{m.value}</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder's Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-1 text-center" data-aos="fade-right">
            <img
              src={founder.image}
              alt={`${founder.name} - ${founder.role}`}
              className="w-44 h-44 rounded-3xl object-cover mx-auto mb-4 border-4 border-indigo-50 shadow-md"
            />
            <h3 className="text-xl font-bold text-slate-900">{founder.name}</h3>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{founder.role}</p>
          </div>

          <div className="lg:col-span-2 space-y-4" data-aos="fade-left">
            <Quote className="w-10 h-10 text-indigo-200" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {founder.quote}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {founder.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values / Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900">Our Core Pillars</h2>
          <p className="text-sm text-slate-500 mt-2">The principles that power our candidate development and corporate partnerships.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = iconMap[pillar.iconName] || Award;
            const bgClass =
              pillar.color === 'emerald'
                ? 'bg-emerald-50 text-emerald-600'
                : pillar.color === 'sky'
                ? 'bg-sky-50 text-sky-600'
                : 'bg-indigo-50 text-indigo-600';

            return (
              <div
                key={pillar.id || idx}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className={`w-12 h-12 rounded-2xl ${bgClass} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Train-and-Hire Detailed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900">The Train-and-Hire Blueprint</h2>
          <p className="text-sm text-slate-500 mt-2">How we transform fresh graduates into high-impact corporate executives.</p>
        </div>
        <ProcessCards />
      </section>
    </div>
  );
}
