import React, { useState, useMemo } from 'react';
import { GitCommit, Sparkles, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ColumnMapper({
  headers = [],
  mapping = {},
  onMappingChange,
  previewRow = {},
  template = null,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all fields supported by the template, or fallback to standard fields
  const dynamicFields = useMemo(() => {
    // 1. If template specifies fields explicitly
    if (template?.fields && Array.isArray(template.fields) && template.fields.length > 0) {
      return template.fields.map((f) => {
        const key = typeof f === 'string' ? f : f.key;
        const label = typeof f === 'object' && f.label
          ? f.label
          : key
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());
        return {
          key,
          label,
          tag: `{{${key}}}`,
          desc: typeof f === 'object' && f.desc ? f.desc : `Dynamic field for ${label}`,
          required: ['name', 'report_no', 'market_value'].includes(key),
        };
      });
    }

    // 2. Scan template htmlContent for {{placeholders}}
    if (template?.htmlContent) {
      const matches = Array.from(
        new Set(
          [...template.htmlContent.matchAll(/{{\s*([\w.-]+)\s*}}/g)].map((m) => m[1])
        )
      );
      if (matches.length > 0) {
        return matches.map((key) => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          tag: `{{${key}}}`,
          desc: `Dynamic tag {{${key}}}`,
          required: false,
        }));
      }
    }

    // 3. Fallback standard fields
    return [
      { key: 'name', label: 'Full Name / Owner', tag: '{{name}}', desc: 'Customer or property owner name', required: true },
      { key: 'report_no', label: 'Report / Doc No', tag: '{{report_no}}', desc: 'Reference or serial number', required: false },
      { key: 'date', label: 'Date', tag: '{{date}}', desc: 'Report or issue date', required: false },
      { key: 'market_value', label: 'Market Value', tag: '{{market_value}}', desc: 'Assessed market value in Lacs', required: true },
      { key: 'address', label: 'Property Address', tag: '{{address}}', desc: 'Property location / address', required: false },
      { key: 'father_name', label: 'Father Name', tag: '{{father_name}}', desc: 'Father / relation name', required: false },
      { key: 'guideline_value', label: 'Guideline Value', tag: '{{guideline_value}}', desc: 'DLC / Guideline value', required: false },
      { key: 'realisable_value', label: 'Realisable Value', tag: '{{realisable_value}}', desc: 'Realisable sale value', required: false },
      { key: 'distress_value', label: 'Distress Value', tag: '{{distress_value}}', desc: 'Distress sale value', required: false },
    ];
  }, [template]);

  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) return dynamicFields;
    const term = searchTerm.toLowerCase();
    return dynamicFields.filter(
      (f) =>
        f.label.toLowerCase().includes(term) ||
        f.key.toLowerCase().includes(term) ||
        f.tag.toLowerCase().includes(term)
    );
  }, [dynamicFields, searchTerm]);

  // Statistics
  const mappedCount = dynamicFields.filter((f) => mapping[f.key]).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-600" />
            <span>Step 3: Dynamic Column Mapping (Excel Headers → PDF Placeholders)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Matching headers from your Excel sheet to template variables. Highlighted keywords in the PDF are replaced dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {mappedCount} of {dynamicFields.length} Mapped
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search placeholders (e.g. market_value, name)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 self-end sm:self-center">
          Showing {filteredFields.length} of {dynamicFields.length} template variables
        </div>
      </div>

      {/* Grid of Mapping Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">
        {filteredFields.map((field) => {
          const selectedCol = mapping[field.key] || '';
          const sampleVal = previewRow[selectedCol] || previewRow[field.key] || '';

          return (
            <div
              key={field.key}
              className={`p-3.5 rounded-xl border transition-all ${
                selectedCol
                  ? 'border-indigo-300 bg-indigo-50/25 shadow-sm'
                  : 'border-slate-200 bg-slate-50/30'
              }`}
            >
              <div className="flex items-start justify-between mb-1 gap-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 truncate" title={field.label}>
                  {field.label}
                  {field.required && <span className="text-rose-500">*</span>}
                </span>
                <code className="text-[10px] bg-amber-100 text-amber-900 font-mono px-1.5 py-0.5 rounded shrink-0 border border-amber-200 font-bold">
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
                Sample:{' '}
                <span className="font-semibold text-slate-700">
                  {sampleVal ? String(sampleVal) : '(empty)'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
