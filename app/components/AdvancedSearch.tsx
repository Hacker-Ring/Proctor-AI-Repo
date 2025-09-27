'use client';

import { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  type: 'calls' | 'documents';
}

interface SearchFilters {
  query: string;
  dateFrom: string;
  dateTo: string;
  type: string;
  vendor?: string;
  sizeMin?: string;
  sizeMax?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdvancedSearch({ onSearch, onClear, type }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateFrom: '',
    dateTo: '',
    type: '',
    vendor: '',
    sizeMin: '',
    sizeMax: '',
    sortBy: type === 'calls' ? 'start_time' : 'upload_date',
    sortOrder: 'desc'
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      dateFrom: '',
      dateTo: '',
      type: '',
      vendor: '',
      sizeMin: '',
      sizeMax: '',
      sortBy: type === 'calls' ? 'start_time' : 'upload_date',
      sortOrder: 'desc'
    });
    onClear();
  };

  const getTypeOptions = () => {
    if (type === 'calls') {
      return [
        { value: '', label: 'All Call Types' },
        { value: 'proctoring', label: 'Proctoring' },
        { value: 'interview', label: 'Interview' },
        { value: 'assessment', label: 'Assessment' }
      ];
    } else {
      return [
        { value: '', label: 'All Document Types' },
        { value: 'application/pdf', label: 'PDF' },
        { value: 'application/msword', label: 'Word Document' },
        { value: 'text/plain', label: 'Text File' },
        { value: 'image/jpeg', label: 'JPEG Image' },
        { value: 'image/png', label: 'PNG Image' }
      ];
    }
  };

  const getSortOptions = () => {
    if (type === 'calls') {
      return [
        { value: 'start_time', label: 'Date' },
        { value: 'call_duration', label: 'Duration' },
        { value: 'call_id', label: 'Call ID' }
      ];
    } else {
      return [
        { value: 'upload_date', label: 'Upload Date' },
        { value: 'document_name', label: 'Name' },
        { value: 'file_size', label: 'Size' },
        { value: 'document_type', label: 'Type' }
      ];
    }
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Search & Filter</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Collapse' : 'Advanced Search'}
        </button>
      </div>

      {/* Basic Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
          />
        </div>
        <button
          onClick={handleSearch}
          className="btn-primary"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="btn-secondary"
        >
          Clear
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {getTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Filter (for calls) */}
            {type === 'calls' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  placeholder="Vendor name"
                  value={filters.vendor || ''}
                  onChange={(e) => handleFilterChange('vendor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            )}

            {/* Size Filter (for documents) */}
            {type === 'documents' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Size (MB)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.sizeMin || ''}
                    onChange={(e) => handleFilterChange('sizeMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Size (MB)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.sizeMax || ''}
                    onChange={(e) => handleFilterChange('sizeMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {getSortOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, dateFrom: today, dateTo: today }));
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-[6px] hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  const today = new Date().toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, dateFrom: weekAgo.toISOString().split('T')[0], dateTo: today }));
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-[6px] hover:bg-gray-200 transition-colors"
              >
                Last 7 days
              </button>
              <button
                onClick={() => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  const today = new Date().toISOString().split('T')[0];
                  setFilters(prev => ({ ...prev, dateFrom: monthAgo.toISOString().split('T')[0], dateTo: today }));
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-[6px] hover:bg-gray-200 transition-colors"
              >
                Last 30 days
              </button>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }));
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-[6px] hover:bg-gray-200 transition-colors"
              >
                All time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
