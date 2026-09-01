import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../components/common/PageHeader';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import {
  updateFormField,
  resetApplicationForm,
  submitBootcampApplication,
} from '../redux/slices/applicationSlice';

export default function Apply() {
  const dispatch = useDispatch();
  const { formData, loading, submitted, error } = useSelector(
    (state) => state.application
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitBootcampApplication(formData));
  };

  const handleChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge="Candidate Registration"
        title="Apply for TalentNestro Bootcamps"
        description="Launch your corporate career with guaranteed skill certification and corporate placement drives."
      />

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm" data-aos="fade-up">
          {submitted ? (
            <div className="p-8 bg-emerald-50 text-emerald-800 rounded-2xl text-center space-y-3 border border-emerald-200">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl text-emerald-950">Application Submitted!</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                Thank you for applying for the <strong>{formData.targetTrack}</strong> track. Our admissions counselor will schedule your initial screening round within 24 hours.
              </p>
              <button
                onClick={() => dispatch(resetApplicationForm())}
                className="mt-4 px-5 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Next Cohort Starts Soon • Limited Seats</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Highest Education</label>
                  <select
                    value={formData.highestEducation}
                    onChange={(e) => handleChange('highestEducation', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  >
                    <option value="Graduate (Any Stream)">Graduate (Any Stream)</option>
                    <option value="BBA / MBA / Management">BBA / MBA / Management</option>
                    <option value="B.Com / Finance">B.Com / Finance</option>
                    <option value="B.A. / Humanities">B.A. / Humanities</option>
                    <option value="B.Sc / BCA">B.Sc / BCA</option>
                    <option value="B.Tech / Engineering">B.Tech / Engineering</option>
                    <option value="Final Year Student">Final Year Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Target Career Track *</label>
                  <select
                    value={formData.targetTrack}
                    onChange={(e) => handleChange('targetTrack', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  >
                    <option value="Business Development Executive">Business Development Executive</option>
                    <option value="HR Operations & Recruiter">HR Operations & Recruiter</option>
                    <option value="Corporate Client Relations">Corporate Client Relations</option>
                    <option value="Digital Growth & Operations">Digital Growth & Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Resume Link (Google Drive / Dropbox / LinkedIn)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.resumeLink}
                  onChange={(e) => handleChange('resumeLink', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting Application...' : 'Submit Bootcamp Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
