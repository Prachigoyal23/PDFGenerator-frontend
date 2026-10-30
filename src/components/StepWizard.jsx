import React from 'react';
import { LayoutTemplate, FileSpreadsheet, GitCommit, DownloadCloud, Check } from 'lucide-react';

export default function StepWizard({ currentStep, setStep, isExcelLoaded }) {
  const steps = [
    { id: 1, title: 'PDF Format', desc: 'Choose Template', icon: LayoutTemplate },
    { id: 2, title: 'Import Excel', desc: 'Upload .xlsx / .csv', icon: FileSpreadsheet },
    { id: 3, title: 'Column Mapping', desc: 'Map User Details', icon: GitCommit, disabled: !isExcelLoaded },
    { id: 4, title: 'Generate & Export', desc: 'Preview & Download', icon: DownloadCloud, disabled: !isExcelLoaded },
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isDisabled = step.disabled;

              return (
                <li key={step.id}>
                  <button
                    disabled={isDisabled}
                    onClick={() => setStep(step.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center space-x-3 ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-500'
                        : isCompleted
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : isDisabled
                        ? 'border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 font-bold" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-semibold text-slate-400">Step {step.id}</span>
                      </div>
                      <div className={`text-sm font-semibold truncate ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {step.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate hidden md:block">
                        {step.desc}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}

