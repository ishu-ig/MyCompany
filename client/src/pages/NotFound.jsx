import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <h1 className="text-6xl font-black text-indigo-600">404</h1>
      <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow">
        Return Home
      </Link>
    </div>
  );
}
