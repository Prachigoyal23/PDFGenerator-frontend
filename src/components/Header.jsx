import React from 'react';
import { FileText, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function Header({ backendStatus, onRefreshStatus }) {
  const appName = import.meta.env.VITE_APP_NAME || 'PDFGen Flow';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">{appName}</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                MERN
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Dynamic Bulk PDF Generation from Excel Spreadsheets
            </p>
          </div>
        </div>

        {/* Backend Status indicator */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              backendStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : backendStatus === 'connecting'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {backendStatus === 'connected' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend Online</span>
              </>
            ) : backendStatus === 'connecting' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Backend Offline</span>
              </>
            )}
          </div>

          <button
            onClick={onRefreshStatus}
            title="Refresh backend status"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

