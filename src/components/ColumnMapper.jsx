import React from 'react';
import { GitCommit, Sparkles, Check, HelpCircle } from 'lucide-react';

export default function ColumnMapper({
  headers = [],
  mapping = {},
  onMappingChange,
  previewRow = {},
}) {
  const dynamicFields = [
    {
      key: 'name',
      label: 'Full Name',
      tag: '{{name}}',
      desc: 'Customer or student name',
      required: true,
    },
    {
      key: 'email',
      label: 'Email Address',
      tag: '{{email}}',
      desc: 'User contact email',
      required: false,
    },
    {
      key: 'phone',
      label: 'Contact Number',
      tag: '{{phone}}',
      desc: 'Mobile or phone number',
      required: false,
    },
    {
      key: 'amount',
      label: 'Amount / Price',
      tag: '{{amount}}',
      desc: 'Amount, salary, or fee',
      required: true,
    },
    {
      key: 'address',
      label: 'Address',
      tag: '{{address}}',
      desc: 'Billing or shipping address',
      required: false,
    },
    {
      key: 'invoice_no',
      label: 'Invoice / Doc No',
      tag: '{{invoice_no}}',
      desc: 'Unique reference number',
      required: false,
    },
    {
      key: 'date',
      label: 'Date',
      tag: '{{date}}',
      desc: 'Issue date',
      required: false,
    },
    {
      key: 'description',
      label: 'Description / Item',
      tag: '{{description}}',
      desc: 'Service or purpose description',
      required: false,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-600" />
            <span>Step 3: Column Mapping (Excel Headers → Dynamic PDF Fields)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Our smart system auto-detected columns based on your sheet. Adjust mappings if needed.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Mapped</span>
        </div>
      </div>

      {/* Grid of Mapping Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicFields.map((field) => {
          const selectedCol = mapping[field.key] || '';
          const sampleVal = previewRow[selectedCol] || '';

          return (
            <div
              key={field.key}
              className={`p-3.5 rounded-xl border transition-all ${
                selectedCol
                  ? 'border-indigo-200 bg-indigo-50/20'
                  : 'border-slate-200 bg-slate-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-rose-500">*</span>}
                </span>
                <code className="text-[10px] bg-indigo-100/70 text-indigo-800 font-mono px-1 rounded">
                  {field.tag}
                </code>
              </div>

              <select
                value={selectedCol}
                onChange={(e) => onMappingChange(field.key, e.target.value)}
                className="w-full mt-1.5 px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Do Not Map --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    Column: {h}
                  </option>
                ))}
              </select>

              {/* Sample preview for this field */}
              <div className="mt-2 text-[11px] truncate text-slate-500">
                Sample: <span className="font-semibold text-slate-700">{sampleVal || '(empty)'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

