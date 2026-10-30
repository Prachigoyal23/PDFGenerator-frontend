import React, { useState } from 'react';
import { X, Play, Save, Code, CheckCircle, RefreshCw } from 'lucide-react';
import { previewTemplateHtml } from '../api/api';

export default function TemplateEditorModal({
  isOpen,
  onClose,
  initialTemplate,
  onSaveTemplate,
}) {
  if (!isOpen) return null;

  const [name, setName] = useState(initialTemplate?.name || 'My Custom PDF Format');
  const [description, setDescription] = useState(
    initialTemplate?.description || 'Custom template created in editor'
  );
  const [orientation, setOrientation] = useState(initialTemplate?.orientation || 'portrait');
  const [pageSize, setPageSize] = useState(initialTemplate?.pageSize || 'A4');
  const [htmlContent, setHtmlContent] = useState(
    initialTemplate?.htmlContent ||
      `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: sans-serif; padding: 40px; color: #1e293b; background: #fff; }
  .box { border: 2px solid #4f46e5; border-radius: 12px; padding: 30px; }
  h1 { color: #4f46e5; margin-bottom: 20px; }
  .field { margin: 10px 0; font-size: 16px; }
</style>
</head>
<body>
  <div class="box">
    <h1>Account Statement / Receipt</h1>
    <div class="field"><strong>Customer Name:</strong> {{name}}</div>
    <div class="field"><strong>Email Address:</strong> {{email}}</div>
    <div class="field"><strong>Contact Number:</strong> {{phone}}</div>
    <div class="field"><strong>Total Amount:</strong> {{amount}}</div>
    <div class="field"><strong>Shipping Address:</strong> {{address}}</div>
    <div class="field"><strong>Invoice #:</strong> {{invoice_no}}</div>
    <div class="field"><strong>Issue Date:</strong> {{date}}</div>
  </div>
</body>
</html>`
  );

  const [testData, setTestData] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    amount: '₹ 15,400.00',
    address: 'Flat 302, Palm Heights, Mumbai, MH',
    invoice_no: 'INV-2026-99',
    date: '2026-10-30',
    description: 'Custom Enterprise Delivery Services',
  });

  const [previewHtml, setPreviewHtml] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRunPreview = async () => {
    setIsPreviewLoading(true);
    try {
      const res = await previewTemplateHtml(null, { htmlContent, orientation, pageSize }, testData);
      setPreviewHtml(res.html);
    } catch (err) {
      console.error('Preview error:', err);
      // Fallback local injection
      let localHtml = htmlContent;
      for (const [k, v] of Object.entries(testData)) {
        localHtml = localHtml.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'gi'), v);
      }
      setPreviewHtml(localHtml);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSave = () => {
    const templatePayload = {
      id: initialTemplate?.id?.startsWith('custom-') ? initialTemplate.id : `custom-${Date.now()}`,
      name,
      description,
      orientation,
      pageSize,
      fields: ['name', 'email', 'phone', 'amount', 'address', 'invoice_no', 'date', 'description'],
      sampleData: testData,
      htmlContent,
    };

    onSaveTemplate(templatePayload);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Custom PDF Template Designer</h3>
              <p className="text-xs text-slate-500">Design in HTML & CSS with live dynamic variable replacement</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunPreview}
              disabled={isPreviewLoading}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
            >
              {isPreviewLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Test Render</span>
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
            >
              {saveSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Saved!' : 'Save & Use Template'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split Editor & Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
          {/* Left: Code & Config */}
          <div className="p-6 flex flex-col space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Premium Membership Pass"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Short summary of this PDF format"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="A4">A4 (Standard)</option>
                  <option value="Letter">US Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
            </div>

            {/* Quick Variable Badges */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Available Dynamic Placeholders (Click to insert):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['name', 'email', 'phone', 'amount', 'address', 'invoice_no', 'date', 'description'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setHtmlContent((prev) => prev + ` {{${tag}}}`)}
                    className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2 py-1 rounded font-mono border border-slate-200 transition"
                  >
                    + &#123;&#123;{tag}&#125;&#125;
                  </button>
                ))}
              </div>
            </div>

            {/* HTML Editor */}
            <div className="flex-1 flex flex-col min-h-[260px]">
              <label className="block text-xs font-semibold text-slate-700 mb-1">HTML & CSS Code</label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full flex-1 p-3 font-mono text-xs text-slate-800 bg-slate-900 !text-emerald-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed resize-none"
                placeholder="<html>...</html>"
              />
            </div>
          </div>

          {/* Right: Live Preview Pane */}
          <div className="p-6 bg-slate-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Live Rendered Preview
              </span>
              <span className="text-xs text-slate-500">
                Rendering for: <strong>{testData.name}</strong>
              </span>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-slate-300 shadow-inner overflow-hidden flex flex-col">
              <iframe
                title="Template Preview"
                srcDoc={previewHtml || htmlContent}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

