import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  GraduationCap,
  Award,
  ShieldCheck,
  Zap,
  Users,
  Search,
  ChevronDown,
  Target,
  BarChart3,
  BookOpen,
  Check
} from 'lucide-react';
import ProcessCards from '../components/sections/ProcessCards';
import TestimonialSlider from '../components/sections/TestimonialSlider';
import { setSearchCode } from '../redux/slices/certificateSlice';
import { setSelectedTrack } from '../redux/slices/courseSlice';

const stats = [
  { value: '500+', label: 'Professionals Trained & Placed', icon: Users, change: '+94% placement rate' },
  { value: '100+', label: 'Corporate Hiring Partners', icon: Building2, change: 'Tier-1 & high-growth startups' },
  { value: '14 Days', label: 'Average Time-to-Deploy', icon: Zap, change: 'vs. 60+ days industry average' },
  { value: '100%', label: 'Verifiable Digital Credentials', icon: Award, change: 'Instant cryptographic validation' },
];

const features = [
  {
    icon: Target,
    title: 'Role-Specific Skill Architecture',
    badge: 'Precision Curriculum',
    description: 'Training mapped 1:1 with real enterprise workflows, modern CRM stacks, data sheets, and communication drills.',
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-100 text-blue-600',
  },
  {
    icon: Zap,
    title: 'Zero Day-1 Ramp-Up Overhead',
    badge: 'Immediate ROI',
    description: 'Candidates arrive pre-coached in real business scenarios, eliminating 2–3 months of corporate training overhead.',
    color: 'from-amber-500/10 to-orange-500/10 border-amber-100 text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Risk-Free Evaluated Talent Pools',
    badge: 'Strict Selection',
    description: 'Rigorous multi-stage vetting assessing communication, logical aptitude, cultural alignment, and capstone scores.',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-100 text-emerald-600',
  },
  {
    icon: Award,
    title: 'QR-Verifiable Digital Credentials',
    badge: 'Tamper-Proof Proof',
    description: 'Every graduate receives a unique credential searchable on our public verification portal with comprehensive grade breakdown.',
    color: 'from-purple-500/10 to-indigo-500/10 border-purple-100 text-purple-600',
  },
  {
    icon: Building2,
    title: 'Custom Corporate Cohort Training',
    badge: 'Bespoke Pipelines',
    description: 'We build and train custom candidate cohorts designed exclusively for your company’s internal tools, scripts, and workflows.',
    color: 'from-indigo-500/10 to-sky-500/10 border-indigo-100 text-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Post-Deployment Support & Analytics',
    badge: 'Guaranteed Fit',
    description: 'Continuous monitoring, replacement guarantees, and talent performance analytics to ensure long-term retention.',
    color: 'from-rose-500/10 to-pink-500/10 border-rose-100 text-rose-600',
  },
];

const faqs = [
  {
    q: "How does the TalentNestro Train-and-Hire model work?",
    a: "We partner with corporations to understand their exact hiring criteria and toolsets. We then screen high-potential candidates, train them through real-world business simulations and live drills, and deploy them directly to hiring partners with zero onboarding delay."
  },
  {
    q: "Who can apply for the skill bootcamps?",
    a: "Our bootcamps are open to fresh graduates from any academic discipline (BBA, B.Com, BA, B.Sc, B.Tech, etc.) as well as early-career professionals looking to transition into high-growth corporate roles like B2B Sales, HR, and Operations."
  },
  {
    q: "How are candidate credentials and certificates verified?",
    a: "Every certificate issued by TalentNestro includes a unique alphanumeric Certificate ID and a verifiable QR code. Anyone can enter the ID on our Verify Certificate page to review authentic student details, batch, score, and completion status."
  },
  {
    q: "What is the cost structure for corporate hiring partners?",
    a: "We offer flexible models tailored to enterprise needs, including success-based placement fees, custom cohort sponsorships, and campus drive execution. Reach out via our Contact page for customized enterprise pricing."
  },
  {
    q: "Are job placements guaranteed upon bootcamp completion?",
    a: "Candidates who successfully meet all attendance milestones, clear weekly assessments, and pass the final capstone evaluation receive guaranteed interview opportunities with our pool of 100+ corporate hiring partners."
  }
];

export default function Home() {
  const [verifyInput, setVerifyInput] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('employers');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courses.courses);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const query = verifyInput.trim();
    if (query) {
      dispatch(setSearchCode(query));
      navigate(`/verify?id=${encodeURIComponent(query)}`);
    } else {
      navigate('/verify');
    }
  };

  const handleTrackSelect = (trackTitle) => {
    dispatch(setSelectedTrack(trackTitle));
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-widest border border-indigo-200 shadow-sm"
              data-aos="fade-down"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              Next-Gen Staffing & Skill Architecture
            </div>

            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]"
              data-aos="fade-up"
            >
              Bridging the Talent Gap with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
                Job-Ready Professionals.
              </span>
            </h1>

            <p
              className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              TalentNestro eliminates corporate hiring delays and candidate unemployability through our proven <strong className="text-slate-800 font-bold">Train-and-Hire ecosystem</strong> — delivering pre-skilled, productive talent on day one.
            </p>

            {/* Hero CTAs */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Link
                to="/services"
                className="px-7 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-2xl transition shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Hire Pre-Trained Talent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/apply"
                className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base rounded-2xl border border-slate-200 transition shadow-sm hover:border-slate-300 transform hover:-translate-y-0.5"
              >
                Apply as Candidate
              </Link>
              <Link
                to="/verify"
                className="px-5 py-4 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Verify Credential</span>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {[
                { label: 'Zero Ramp-Up Cost', sub: 'Day-1 Productive' },
                { label: '95% Placement Rate', sub: 'Guaranteed Drives' },
                { label: '100+ Hiring Partners', sub: 'Verified Companies' },
                { label: 'Tamper-Proof QR', sub: 'Instant Credential Lookup' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Impact Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 group"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features & Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
            Why TalentNestro
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Engineered Features for Modern Hiring & Skill Building
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A comprehensive suite of capabilities designed to eliminate recruitment mismatches, cut corporate training costs, and fast-track career trajectories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} border flex items-center justify-center group-hover:scale-110 transition duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition duration-200 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:gap-2.5 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Specialized Career Tracks / Programs (from Redux state) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3.5 py-1 rounded-full border border-indigo-800">
                  Career Programs
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  High-Impact Training Tracks
                </h2>
                <p className="text-sm text-slate-300">
                  Industry-designed curriculums packed with live corporate simulations, roleplays, and digital certifications.
                </p>
              </div>

              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition shadow-lg self-start md:self-auto"
              >
                <span>Enroll in Next Batch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((track, idx) => (
                <div
                  key={track.id || idx}
                  className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 hover:border-indigo-500/60 rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-indigo-950 text-indigo-300 border-indigo-800">
                        {track.badge || 'Certified Track'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {track.duration || '6 Weeks'} • Hybrid / Live
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {track.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {track.description || 'Master corporate workflows, toolsets, and communication drills designed for day-1 productivity.'}
                    </p>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Core Competencies Covered:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(track.skills || ['Communication', 'CRM Tools', 'Business Operations', 'Live Simulations']).map((skill, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-200">
                            <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            <span>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Target Roles:</strong> {track.targetRoles || 'Executive, Specialist'}
                    </div>
                    <Link
                      to="/apply"
                      onClick={() => handleTrackSelect(track.title)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition flex-shrink-0"
                    >
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Our Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The 3-Step Train-and-Hire Model
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A frictionless pipeline engineered to eliminate corporate ramp-up delays and candidate unemployability.
          </p>
        </div>

        <ProcessCards />
      </section>

      {/* Audience Value Proposition (Interactive Dual Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Tailored Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Who We Create Value For
          </h2>
          <p className="text-sm text-slate-600">
            Whether you are scaling a sales team, launching a university drive, or seeking your first breakthrough job.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('employers')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'employers'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Corporate Employers
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'candidates'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Candidates & Graduates
            </button>
            <button
              onClick={() => setActiveTab('colleges')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'colleges'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Colleges & Universities
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          {activeTab === 'employers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in duration-300">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                  <Building2 className="w-4 h-4" /> Enterprise Hiring Solution
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Cut Hiring Time by 65% & Deploy Day-1 Ready Talent
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Say goodbye to candidate no-shows, mismatched skillsets, and long ramp-up cycles. We supply pre-trained cohorts configured precisely for your sales scripts, CRM workflows, and operational metrics.
                </p>
                <div className="space-y-2.5 pt-2">
                  {[
                    'Custom curriculum co-designed with your hiring managers',
                    'Zero initial recruitment cost — pay only on successful hiring milestones',
                    'Comprehensive background verification and verifiable assessment scorecards',
                    '30-day replacement guarantee with dedicated account management',
                  ].map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-indigo-600/20"
                  >
                    Request Corporate Consultation <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Corporate Hiring Benchmark</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                      <span>Traditional Hiring Ramp-Up</span>
                      <span className="text-rose-600">60 - 90 Days</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[85%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                      <span>TalentNestro Train-and-Hire</span>
                      <span className="text-emerald-600 font-black">14 Days (Zero Ramp-Up)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[25%]" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-900 block">Typical Roles Deployed:</span>
                  <p>B2B Sales Executives, Inside Sales Specialists, HR Operations, Talent Sourcers, Customer Relations, Operations Associates.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in duration-300">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                  <GraduationCap className="w-4 h-4" /> Career Acceleration
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Transform Your Degree into a Thriving Corporate Career
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Degrees teach theory; we teach practical execution. Get trained on live tools, simulated client interactions, and executive presentation drills with direct placement support.
                </p>
                <div className="space-y-2.5 pt-2">
                  {[
                    '1-on-1 mentorship with active corporate sales and HR leaders',
                    'Hands-on live capstone projects to showcase in your portfolio',
                    'Direct placement drives with verified partner companies',
                    'Tamper-proof verifiable digital certificate with QR authentication',
                  ].map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    to="/apply"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-emerald-600/20"
                  >
                    Apply for Candidate Batch <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-100 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900">Graduate Outcomes</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">3.5 - 6.5 LPA</p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Average Starting CTC</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 text-center">
                    <p className="text-2xl font-black text-emerald-600">10 Days</p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Average Placement Time</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block mb-1">Open To All Graduates:</span>
                  <p>BBA, B.Com, BA, B.Sc, BCA, B.Tech graduates seeking non-IT and business management roles.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colleges' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-in fade-in duration-300">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                  <BookOpen className="w-4 h-4" /> Campus Employability
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Elevate Your Institution's Campus Placement Record
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We partner with colleges to conduct pre-placement finishing bootcamps, resume clinics, and connect final-year batches with hiring corporate partners.
                </p>
                <div className="space-y-2.5 pt-2">
                  {[
                    'Custom campus bootcamps aligned with academic schedules',
                    'Mock GD & PI sessions led by senior corporate panelists',
                    'Pooled placement drives with tier-1 recruiters',
                    'Real-time student progress & readiness dashboards for TPO heads',
                  ].map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-amber-600/20"
                  >
                    Schedule Campus Placement Drive <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 border border-amber-100 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900">Campus Partnership Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 text-xs">
                    <span className="font-semibold text-slate-700">Placement Rate Increase:</span>
                    <span className="font-bold text-amber-700">+42% Year-on-Year</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 text-xs">
                    <span className="font-semibold text-slate-700">Partner Universities:</span>
                    <span className="font-bold text-amber-700">25+ Institutions</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 text-xs">
                    <span className="font-semibold text-slate-700">Avg Corporate Offers per Drive:</span>
                    <span className="font-bold text-amber-700">35+ Offers</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Certificate Verification Interactive Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-700/50">
                Instant Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Authentic, Tamper-Proof Skill Credentials
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-xl">
                Every TalentNestro certificate is registered on a cryptographically secured database. Employers can authenticate candidate completion status, track scores, and graduation dates instantly.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleVerifySubmit} className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 space-y-3">
                <label className="block text-xs font-bold text-indigo-100 uppercase tracking-wider">
                  Enter Certificate ID
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. TN-2026-001"
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Verify</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-indigo-200 pt-1">
                  <span>Try demo ID: <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-indigo-200">TN-2026-001</code></span>
                  <Link to="/verify" className="underline hover:text-white font-semibold">
                    Open Full Portal
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Success Stories (from Redux state) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Real Stories, Real Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trusted by Leaders and Job Seekers
          </h2>
          <p className="text-sm text-slate-600">
            Hear from hiring managers who upgraded their team velocity and candidates who unlocked their true potential.
          </p>
        </div>

        <TestimonialSlider />
      </section>

      {/* Frequently Asked Questions (Interactive Accordion) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about our recruitment ecosystem and candidate bootcamps.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-indigo-600 transition focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            Have more questions?{' '}
            <Link to="/contact" className="text-indigo-600 font-bold hover:underline">
              Contact our admissions & corporate team
            </Link>
          </p>
        </div>
      </section>

      {/* Corporate Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl"
          data-aos="zoom-in"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-indigo-900/30 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-3.5 py-1 rounded-full border border-indigo-800">
              Get Started Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Hiring Pipeline & Accelerate Your Career?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Partner with TalentNestro to deploy custom-trained cohorts or join our upcoming intensive corporate readiness bootcamps.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/contact"
                className="px-7 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
              >
                Partner as Employer
              </Link>
              <Link
                to="/apply"
                className="px-7 py-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm rounded-2xl transition shadow-md transform hover:-translate-y-0.5"
              >
                Apply for Bootcamp
              </Link>
              <Link
                to="/about"
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition"
              >
                Learn Founder's Vision
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
