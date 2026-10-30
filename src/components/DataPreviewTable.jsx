import React, { useState, useMemo } from 'react';
import { Search, Users, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataPreviewTable({
  records = [],
  mapping = {},
  selectedRowIndex = 0,
  onSelectRow,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered rows
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const term = searchTerm.toLowerCase();

    return records.filter((r) => {
      return Object.values(r).some((v) =>
        String(v).toLowerCase().includes(term)
      );
    });
  }, [records, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Imported Users Dataset ({records.length} total)
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, amount..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  No records match your search query.
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx;
                const isSelected = selectedRowIndex === globalIndex;

                const nameVal = row[mapping.name] || row['name'] || `User #${globalIndex + 1}`;
                const emailVal = row[mapping.email] || row['email'] || '-';
                const phoneVal = row[mapping.phone] || row['phone'] || '-';
                const amountVal = row[mapping.amount] || row['amount'] || '0.00';
                const addressVal = row[mapping.address] || row['address'] || '-';

                return (
                  <tr
                    key={globalIndex}
                    onClick={() => onSelectRow(globalIndex)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 font-medium'
                        : 'hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4 text-center text-slate-400">
                      {globalIndex + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {nameVal}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{emailVal}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{phoneVal}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{amountVal}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={addressVal}>
                      {addressVal}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRow(globalIndex);
                        }}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>{isSelected ? 'Viewing' : 'Preview'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

