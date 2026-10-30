import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatBytes } from '../utils/helpers';
import { downloadSampleExcelUrl } from '../api/api';

export default function ExcelUploader({
  onFileUpload,
  uploadedFile,
  parsedData,
  isLoading,
  onReset,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg('');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    setErrorMsg('');
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      setErrorMsg('Please upload a valid Excel spreadsheet (.xlsx, .xls) or .csv file.');
      return;
    }

    onFileUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Top action: Download Sample & instructions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Step 2: Upload Excel Sheet with Dynamic User Data</span>
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload your sheet containing users' name, email, contact number, amount, address, etc.
          </p>
        </div>

        <a
          href={downloadSampleExcelUrl}
          download="Dynamic_PDF_Users_Sample.xlsx"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample Excel</span>
        </a>
      </div>

      {/* Upload Box or File Details */}
      {!uploadedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            isDragOver
              ? 'border-indigo-600 bg-indigo-50/50 scale-[1.005]'
              : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-inner">
            {isLoading ? (
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div className="text-base font-bold text-slate-800">
            {isLoading ? 'Processing Spreadsheet...' : 'Drop your Excel file here, or browse'}
          </div>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
            Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv). Up to 20MB and thousands of rows.
          </p>

          <button
            type="button"
            className="mt-5 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            Select Spreadsheet
          </button>
        </div>
      ) : (
        /* File Card when already uploaded */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-base">{uploadedFile.name}</h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Size: {formatBytes(uploadedFile.size)}</span>
                  <span>•</span>
                  <span>Sheet: <strong>{parsedData?.sheetName || 'Sheet1'}</strong></span>
                  <span>•</span>
                  <span>
                    Rows Detected: <strong className="text-indigo-600">{parsedData?.totalRows || 0} users</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                Change File
              </button>
              <button
                onClick={onReset}
                className="px-3.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

