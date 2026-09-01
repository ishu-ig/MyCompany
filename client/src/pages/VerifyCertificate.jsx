import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import {
  verifyCertificate as verifyCertificateAction,
  setSearchCode,
} from '../redux/slices/certificateSlice';

export default function VerifyCertificate() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { searchCode, result, loading, searched, error } = useSelector(
    (state) => state.certificate
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    if (idParam) {
      dispatch(setSearchCode(idParam));
      dispatch(verifyCertificateAction(idParam));
    }
  }, [location.search, dispatch]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (searchCode && searchCode.trim()) {
      dispatch(verifyCertificateAction(searchCode));
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge="Credential Verification"
        title="Public Certificate Ledger"
        description="Authenticate digital skill credentials issued by TalentNestro to certified non-IT bootcamp graduates."
      />

      <div className="max-w-3xl mx-auto px-4">
        {/* Search Input Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4" data-aos="fade-up">
          <h2 className="text-lg font-bold text-slate-900">Enter Verification Code or Certificate ID</h2>
          <p className="text-xs text-slate-500">
            Enter the unique credential code or ID printed on the certificate (e.g. <code>TN-2026-001</code> or <code>CERT-EXEC-2026</code>).
          </p>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <ShieldCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={searchCode}
                onChange={(e) => dispatch(setSearchCode(e.target.value))}
                placeholder="e.g. TN-2026-001 or CERT-EXEC-2026"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Verifying...' : 'Verify Credential'}
            </button>
          </form>
        </div>

        {/* Verification Result Display */}
        {searched && (
          <div className="mt-8" data-aos="fade-up">
            {result ? (
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      Verified & Authentic Credential
                    </span>
                    <h3 className="text-xl font-black text-emerald-950 mt-1">Official TalentNestro Certification</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/90 p-5 rounded-2xl border border-emerald-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Recipient Name</span>
                    <span className="font-bold text-slate-900 text-sm">{result.candidate?.name || 'Rahul Sharma'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Certified Track</span>
                    <span className="font-bold text-indigo-700 text-sm">{result.course?.title || 'Business Executive Track'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Certificate #</span>
                    <span className="font-mono font-semibold text-slate-700">{result.certificateNumber || 'TN-2026-001'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Performance Grade</span>
                    <span className="font-bold text-emerald-700">{result.grade || 'Distinction'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Issue Date</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(result.issueDate || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
                    <span className="text-emerald-700 font-bold">✓ Active in Employer Verification Ledger</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-2">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-rose-900">No Matching Certificate Found</h3>
                <p className="text-xs text-rose-700">
                  {error || 'The verification code or certificate ID you entered is invalid or has not been issued yet. Please check the code and try again.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
