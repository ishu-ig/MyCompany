import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <span>TalentNestro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering graduates and corporations through our proven Train-and-Hire skill architecture.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link to="/apply" className="hover:text-white transition">Apply for Bootcamp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">Programs</h4>
            <ul className="space-y-2">
              <li>Business Development</li>
              <li>HR & Talent Acquisition</li>
              <li>Sales & Client Relations</li>
              <li>Campus Collaboration</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-indigo-400" /> partner@talentnestro.com</li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Delhi NCR • Mumbai • Bengaluru</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center">
          <p>© {new Date().getFullYear()} TalentNestro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
