import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, School, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { setSelectedCategory } from '../redux/slices/serviceSlice';

const iconMap = {
  Building2: Building2,
  School: School,
  GraduationCap: GraduationCap,
};

export default function Services() {
  const dispatch = useDispatch();
  const { services, selectedCategory } = useSelector((state) => state.services);

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="space-y-20 pb-20">
      <PageHeader
        badge="What We Offer"
        title="Comprehensive Staffing & Skill Architecture"
        description="Explore how TalentNestro connects employers, higher education institutions, and aspiring candidates."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Filter Tabs */}
        <div className="flex justify-center">
          <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1 border border-slate-200">
            {[
              { label: 'All Services', value: 'all' },
              { label: 'For Employers', value: 'employers' },
              { label: 'For Universities', value: 'colleges' },
              { label: 'For Candidates', value: 'candidates' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => dispatch(setSelectedCategory(tab.value))}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  selectedCategory === tab.value
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-8">
          {filteredServices.map((service, idx) => {
            const Icon = iconMap[service.iconName] || Building2;
            return (
              <div
                key={service.id || idx}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center hover:border-indigo-200 transition-all duration-300"
                data-aos="fade-up"
              >
                <div className="lg:col-span-2 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {service.badge}
                  </span>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 text-center lg:text-right">
                  <Link
                    to={service.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-indigo-600/20"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
