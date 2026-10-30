import React from 'react';
import { Eye, Edit3, CheckCircle, Sparkles, Plus, Code, HelpCircle } from 'lucide-react';

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onOpenCustomEditor,
  onPreviewSample,
}) {
  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-5 rounded-2xl border border-indigo-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Step 1: Select PDF Format & Dynamic Fields
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Choose a pre-designed layout or customize your own. The dynamic tags (
            <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-semibold border border-indigo-200">
              &#123;&#123;name&#125;&#125;
            </code>
            ,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-semibold border border-indigo-200">
              &#123;&#123;email&#125;&#125;
            </code>
            ,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-semibold border border-indigo-200">
              &#123;&#123;phone&#125;&#125;
            </code>
            ,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-semibold border border-indigo-200">
              &#123;&#123;amount&#125;&#125;
            </code>
            ,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-semibold border border-indigo-200">
              &#123;&#123;address&#125;&#125;
            </code>
            ) will be replaced automatically for every row in your Excel sheet.
          </p>
        </div>

        <button
          onClick={onOpenCustomEditor}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow-sm shrink-0"
        >
          <Code className="w-4 h-4" />
          <span>HTML / CSS Editor</span>
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {templates.map((tpl) => {
          const isSelected = selectedTemplate?.id === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`relative rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'border-indigo-600 bg-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Banner Tag */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {tpl.orientation || 'portrait'} • {tpl.pageSize || 'A4'}
                  </span>
                  {isSelected ? (
                    <span className="flex items-center space-x-1 text-xs font-semibold text-indigo-600">
                      <CheckCircle className="w-4 h-4 fill-indigo-600 text-white" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 group-hover:text-indigo-600">Select</span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-base">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>
              </div>

              {/* Supported Dynamic Fields Tags */}
              <div className="px-5 py-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Dynamic Placeholders:
                </div>
                <div className="flex flex-wrap gap-1">
                  {(tpl.fields || ['name', 'email', 'phone', 'amount', 'address']).slice(0, 5).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] bg-indigo-50 text-indigo-700 font-mono px-1.5 py-0.5 rounded border border-indigo-100"
                    >
                      &#123;&#123;{f}&#125;&#125;
                    </span>
                  ))}
                  {tpl.fields?.length > 5 && (
                    <span className="text-[10px] text-slate-400">+{tpl.fields.length - 5} more</span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewSample(tpl);
                  }}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Layout</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(tpl);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Use Format'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

