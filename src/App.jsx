import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StepWizard from './components/StepWizard';
import TemplateSelector from './components/TemplateSelector';
import TemplateEditorModal from './components/TemplateEditorModal';
import ExcelUploader from './components/ExcelUploader';
import ColumnMapper from './components/ColumnMapper';
import DataPreviewTable from './components/DataPreviewTable';
import PdfLivePreview from './components/PdfLivePreview';
import {
  checkHealth,
  fetchTemplates,
  saveTemplate,
  parseExcelFile,
  previewTemplateHtml,
  generateSinglePdfBlob,
  generateBatchZipBlob,
} from './api/api';
import { triggerBlobDownload } from './utils/helpers';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Backend & System status
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Workflow state
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [mapping, setMapping] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  // Preview state
  const [previewHtml, setPreviewHtml] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Action states
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isDownloadingSingle, setIsDownloadingSingle] = useState(false);
  const [isDownloadingBatch, setIsDownloadingBatch] = useState(false);
  const [isCustomEditorOpen, setIsCustomEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // 1. Initial health and template check
  const initSystem = useCallback(async () => {
    setBackendStatus('connecting');
    try {
      await checkHealth();
      setBackendStatus('connected');

      const tplRes = await fetchTemplates();
      if (tplRes.success && tplRes.templates?.length > 0) {
        setTemplates(tplRes.templates);
        setSelectedTemplate((prev) => prev || tplRes.templates[0]);
      }
    } catch (err) {
      console.warn('Backend connection error:', err);
      setBackendStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    initSystem();
  }, [initSystem]);

  // Helper to extract mapped row data for a specific index
  const getMappedRow = useCallback(
    (rowIndex) => {
      if (!parsedData?.allRows || !parsedData.allRows[rowIndex]) {
        return selectedTemplate?.sampleData || {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 019-2834',
          amount: '4,500.00',
          address: '742 Evergreen Terrace, Springfield, OR',
          invoice_no: 'INV-2026-001',
          date: '2026-10-30',
          description: 'Professional Services',
        };
      }

      const rawRow = parsedData.allRows[rowIndex];
      return {
        _rowIndex: rowIndex + 1,
        name: rawRow[mapping.name] || rawRow['name'] || `User #${rowIndex + 1}`,
        email: rawRow[mapping.email] || rawRow['email'] || '',
        phone: rawRow[mapping.phone] || rawRow['phone'] || '',
        amount: rawRow[mapping.amount] || rawRow['amount'] || '0.00',
        address: rawRow[mapping.address] || rawRow['address'] || '',
        invoice_no: rawRow[mapping.invoice_no] || rawRow['invoice_no'] || `INV-${1000 + rowIndex + 1}`,
        date: rawRow[mapping.date] || rawRow['date'] || new Date().toISOString().split('T')[0],
        description: rawRow[mapping.description] || rawRow['description'] || 'Professional Services',
      };
    },
    [parsedData, mapping, selectedTemplate]
  );

  // 2. Update Live Preview whenever template or selected row changes
  useEffect(() => {
    if (!selectedTemplate) return;

    let isSubscribed = true;
    const updatePreview = async () => {
      setIsLoadingPreview(true);
      try {
        const record = getMappedRow(selectedRowIndex);
        const res = await previewTemplateHtml(selectedTemplate.id, selectedTemplate, record);
        if (isSubscribed) {
          setPreviewHtml(res.html);
        }
      } catch (err) {
        // Fallback local injection if backend preview fails
        if (isSubscribed) {
          const record = getMappedRow(selectedRowIndex);
          let local = selectedTemplate.htmlContent || '';
          for (const [k, v] of Object.entries(record)) {
            local = local.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'gi'), String(v));
          }
          setPreviewHtml(local);
        }
      } finally {
        if (isSubscribed) setIsLoadingPreview(false);
      }
    };

    updatePreview();

    return () => {
      isSubscribed = false;
    };
  }, [selectedTemplate, selectedRowIndex, mapping, getMappedRow]);

  // Handle Excel Upload
  const handleFileUpload = async (file) => {
    setIsLoadingFile(true);
    try {
      const res = await parseExcelFile(file);
      if (res.success && res.data) {
        setUploadedFile(file);
        setParsedData(res.data);
        setMapping(res.data.suggestedMapping || {});
        setSelectedRowIndex(0);
        setCurrentStep(3); // Advance to mapping step automatically
        showNotification(
          'success',
          `Spreadsheet loaded successfully! Found ${res.data.totalRows} records.`
        );
      }
    } catch (err) {
      console.error('File parsing error:', err);
      showNotification('error', err.response?.data?.message || 'Failed to parse Excel spreadsheet.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleResetFile = () => {
    setUploadedFile(null);
    setParsedData(null);
    setMapping({});
    setSelectedRowIndex(0);
    setCurrentStep(2);
  };

  const handleMappingChange = (key, value) => {
    setMapping((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save / Update Custom Template
  const handleSaveCustomTemplate = async (newTpl) => {
    try {
      await saveTemplate(newTpl);
      setTemplates((prev) => [newTpl, ...prev.filter((t) => t.id !== newTpl.id)]);
      setSelectedTemplate(newTpl);
      showNotification('success', 'Custom PDF template saved successfully!');
    } catch (err) {
      console.error('Failed to save template:', err);
      // Still set it locally
      setTemplates((prev) => [newTpl, ...prev.filter((t) => t.id !== newTpl.id)]);
      setSelectedTemplate(newTpl);
      showNotification('success', 'Custom PDF template applied locally!');
    }
  };

  // Download Single PDF
  const handleDownloadSinglePdf = async () => {
    if (!selectedTemplate) return;
    setIsDownloadingSingle(true);
    try {
      const record = getMappedRow(selectedRowIndex);
      const res = await generateSinglePdfBlob(selectedTemplate.id, selectedTemplate, record);

      const fileName = `${(record.name || 'document').replace(/\s+/g, '_')}_${record.invoice_no || 'doc'}.pdf`;
      triggerBlobDownload(res.data, fileName);
      showNotification('success', `Downloaded PDF for ${record.name}!`);
    } catch (err) {
      console.error('Download error:', err);
      showNotification('error', 'Failed to generate single PDF. Check backend console.');
    } finally {
      setIsDownloadingSingle(false);
    }
  };

  // Download Batch ZIP
  const handleDownloadBatchZip = async () => {
    if (!selectedTemplate || !parsedData?.allRows?.length) {
      showNotification('error', 'Please upload an Excel spreadsheet before batch export.');
      return;
    }

    setIsDownloadingBatch(true);
    try {
      const res = await generateBatchZipBlob(
        selectedTemplate.id,
        selectedTemplate,
        parsedData.allRows,
        mapping
      );

      const zipName = `Generated_PDFs_${parsedData.allRows.length}_users.zip`;
      triggerBlobDownload(res.data, zipName);
      showNotification(
        'success',
        `Successfully generated and downloaded ${parsedData.allRows.length} PDFs in ZIP!`
      );
    } catch (err) {
      console.error('Batch export error:', err);
      showNotification('error', 'Failed to generate batch ZIP. Check backend logs.');
    } finally {
      setIsDownloadingBatch(false);
    }
  };

  const activeRecord = getMappedRow(selectedRowIndex);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <Header backendStatus={backendStatus} onRefreshStatus={initSystem} />

      {/* Wizard Progress */}
      <StepWizard
        currentStep={currentStep}
        setStep={setCurrentStep}
        isExcelLoaded={!!parsedData}
      />

      {/* Notifications Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 transition-all transform animate-bounce">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
              onOpenCustomEditor={() => {
                setEditingTemplate(selectedTemplate);
                setIsCustomEditorOpen(true);
              }}
              onPreviewSample={(tpl) => {
                setSelectedTemplate(tpl);
                setCurrentStep(4);
              }}
            />

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-100"
              >
                <span>Continue to Step 2: Upload Excel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Excel Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <ExcelUploader
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              parsedData={parsedData}
              isLoading={isLoadingFile}
              onReset={handleResetFile}
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold text-sm transition"
              >
                Back to Templates
              </button>

              {parsedData && (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md"
                >
                  <span>Continue to Step 3: Column Mapping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Column Mapping */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <ColumnMapper
              headers={parsedData?.headers || []}
              mapping={mapping}
              onMappingChange={handleMappingChange}
              previewRow={parsedData?.allRows?.[0] || {}}
            />

            {/* Quick Data Preview Table */}
            {parsedData?.allRows && (
              <DataPreviewTable
                records={parsedData.allRows}
                mapping={mapping}
                selectedRowIndex={selectedRowIndex}
                onSelectRow={(idx) => {
                  setSelectedRowIndex(idx);
                  setCurrentStep(4);
                }}
              />
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold text-sm transition"
              >
                Back to Excel Upload
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-100"
              >
                <span>Continue to Step 4: Preview & Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Live PDF Preview & Bulk Generation */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: User dataset list (if loaded) */}
            <div className="lg:col-span-5 space-y-4">
              {parsedData?.allRows ? (
                <DataPreviewTable
                  records={parsedData.allRows}
                  mapping={mapping}
                  selectedRowIndex={selectedRowIndex}
                  onSelectRow={(idx) => setSelectedRowIndex(idx)}
                />
              ) : (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Previewing with Sample Data</h4>
                  <p className="text-xs text-slate-500">
                    Upload your Excel sheet to generate PDFs for all your actual users.
                  </p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                  >
                    Upload Excel Sheet
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live PDF Preview & Actions */}
            <div className="lg:col-span-7">
              <PdfLivePreview
                previewHtml={previewHtml}
                isLoadingPreview={isLoadingPreview}
                activeRecord={activeRecord}
                totalRecordsCount={parsedData?.allRows?.length || 1}
                onDownloadSingle={handleDownloadSinglePdf}
                onDownloadBatchZip={handleDownloadBatchZip}
                isDownloadingSingle={isDownloadingSingle}
                isDownloadingBatch={isDownloadingBatch}
                templateName={selectedTemplate?.name || 'Default Format'}
              />
            </div>
          </div>
        )}
      </main>

      {/* Custom Template Editor Modal */}
      <TemplateEditorModal
        isOpen={isCustomEditorOpen}
        onClose={() => setIsCustomEditorOpen(false)}
        initialTemplate={editingTemplate}
        onSaveTemplate={handleSaveCustomTemplate}
      />
    </div>
  );
}
