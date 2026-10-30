import React from 'react';
import { DownloadCloud, FileText, CheckCircle2, RefreshCw, Archive, Sparkles, UserCheck } from 'lucide-react';

export default function PdfLivePreview({
  previewHtml,
  isLoadingPreview,
  activeRecord,
  totalRecordsCount,
  onDownloadSingle,
  onDownloadBatchZip,
  isDownloadingSingle,
  isDownloadingBatch,
  templateName,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full space-y-4 p-5">
      {/* Top Banner & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Step 4: Live PDF Preview & Bulk Generation</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Format: <strong className="text-slate-800">{templateName}</strong> • Previewing record for:{' '}
            <strong className="text-indigo-600">{activeRecord?.name || 'Selected User'}</strong>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Single PDF */}
          <button
            onClick={onDownloadSingle}
            disabled={isDownloadingSingle || !activeRecord}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition disabled:opacity-50"
          >
            {isDownloadingSingle ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>Download Selected PDF</span>
          </button>

          {/* Download All as ZIP */}
          <button
            onClick={onDownloadBatchZip}
            disabled={isDownloadingBatch || totalRecordsCount === 0}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold transition shadow-md shadow-indigo-100 disabled:opacity-50"
          >
            {isDownloadingBatch ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating {totalRecordsCount} PDFs...</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Generate All {totalRecordsCount} PDFs (ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected User Highlights */}
      {activeRecord && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">User Name</span>
            <span className="font-semibold text-slate-800 truncate block">{activeRecord.name || '-'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
            <span className="font-medium text-slate-700 truncate block">{activeRecord.email || '-'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
            <span className="font-mono text-slate-700 truncate block">{activeRecord.phone || '-'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Amount</span>
            <span className="font-bold text-emerald-600 truncate block">{activeRecord.amount || '-'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Address</span>
            <span className="text-slate-600 truncate block" title={activeRecord.address}>
              {activeRecord.address || '-'}
            </span>
          </div>
        </div>
      )}

      {/* Live Preview Container */}
      <div className="relative flex-1 min-h-[520px] rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shadow-inner flex flex-col items-center justify-center">
        {isLoadingPreview && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-semibold text-slate-700">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Rendering Live PDF Preview...</span>
            </div>
          </div>
        )}

        {previewHtml ? (
          <iframe
            title="Generated PDF Preview"
            srcDoc={previewHtml}
            className="w-full h-full min-h-[520px] bg-white border-0 shadow-sm"
          />
        ) : (
          <div className="text-center p-8 text-slate-400 text-xs">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p>Select a user or template to preview PDF.</p>
          </div>
        )}
      </div>
    </div>
  );
}

