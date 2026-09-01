import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import {
  updateContactField,
  resetContactForm,
  submitInquiry,
} from '../redux/slices/contactSlice';

const strategicFaqs = [
  {
    q: 'How does the Train-and-Hire Model work for corporate employers?',
    a: 'We understand your specific role requirements, recruit matching foundational candidates, train them through real-world corporate simulations, and deploy them to your team ready to contribute from day one.',
  },
  {
    q: 'What is the duration of the bootcamps?',
    a: 'Bootcamp programs typically range from 4 to 8 weeks depending on the technical depth or business operations track.',
  },
  {
    q: 'Can colleges partner for pooled campus placement bootcamps?',
    a: 'Yes! We collaborate directly with higher education placement cells to conduct employability clinics and connect graduating batches with enterprise hiring partners.',
  },
];

export default function Contact() {
  const dispatch = useDispatch();
  const { formData, loading, submitted } = useSelector((state) => state.contact);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleChange = (e) => {
    dispatch(updateContactField({ field: e.target.name, value: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitInquiry(formData));
  };

  return (
    <div className="space-y-16 pb-20">
      <PageHeader
        badge="Connect & Collaborate"
        title="Partner With TalentNestro"
        description="Whether you are an enterprise seeking skilled talent or a college planning placement drives, let's build your solution."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Contact Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm" data-aos="fade-right">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send an Inquiry</h2>
            <p className="text-xs text-slate-500 mb-6">Our partnerships director will connect with you within 24 hours.</p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-sm space-y-2">
                <p className="font-bold">🎉 Thank you! Your inquiry has been received.</p>
                <p className="text-xs text-emerald-700">Our enterprise partnerships team will contact you shortly with custom hiring and cohort details.</p>
                <button
                  onClick={() => dispatch(resetContactForm())}
                  className="mt-2 text-xs font-bold text-emerald-900 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@company.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Organization / College</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. CloudScale Tech / Apex Univ"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">I am representing</label>
                  <select
                    name="roleType"
                    value={formData.roleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  >
                    <option value="Corporate Partner">Corporate Employer</option>
                    <option value="College Institution">College / University Placement Cell</option>
                    <option value="Candidate">Candidate / Career Seeker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Message / Requirements *</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your hiring volume, skill requirements, or partnership goals..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Partnership Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: FAQs Accordion */}
          <div className="space-y-6" data-aos="fade-left">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Strategic FAQs</h2>
              <p className="text-xs text-slate-500">Common questions from enterprise hiring partners and colleges.</p>
            </div>

            <div className="space-y-3">
              {strategicFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                      className="w-full p-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-slate-900 transition"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
