'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Search, Filter, X, ChevronDown } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

interface FilterBarProps {
  filters: {
    dateRange: '7days' | '30days' | '90days' | 'custom';
    role: 'admin' | 'manager' | 'user' | 'all';
    search: string;
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange: (filters: {
    dateRange: '7days' | '30days' | '90days' | 'custom';
    role: 'admin' | 'manager' | 'user' | 'all';
    search: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onReset: () => void;
}

const dateRangeOptions = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
];

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' },
];

export default function FilterBar({ filters, onFiltersChange, onReset }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Animation variants
  const containerVariants = {
    collapsed: { height: 'auto' },
    expanded: { height: 'auto' }
  };
  
  const contentVariants = {
    collapsed: { opacity: 0, y: -10, display: 'none' },
    expanded: { opacity: 1, y: 0, display: 'block', transition: { delay: 0.1 } }
  };
  
  const iconVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // If changing from custom to preset date range, clear custom dates
    if (key === 'dateRange' && value !== 'custom') {
      newFilters.startDate = undefined;
      newFilters.endDate = undefined;
      setLocalFilters(newFilters);
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsExpanded(false);
  };

  const handleReset = () => {
    const defaultFilters = {
      dateRange: '30days' as const,
      role: 'all' as const,
      search: '',
      startDate: undefined,
      endDate: undefined,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onReset();
    setIsExpanded(false);
  };

  const hasActiveFilters = filters.search || filters.role !== 'all' || filters.dateRange !== '30days';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
          />
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date Range
                </label>
                {localFilters.dateRange === 'custom' ? (
                  <DateRangePicker
                    startDate={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
                    endDate={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
                    onChange={(start, end) => {
                      setLocalFilters({
                        ...localFilters,
                        startDate: start?.toISOString(),
                        endDate: end?.toISOString(),
                      });
                    }}
                    className="w-full"
                  />
                ) : (
                  <select
                    value={localFilters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  >
                    {dateRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <select
                  value={localFilters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Range */}
              {localFilters.dateRange === 'custom' && (
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={localFilters.startDate || ''}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={localFilters.endDate || ''}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleApplyFilters}
                className="btn-primary px-6 py-2"
              >
                Apply Filters
              </button>
              
              <button
                onClick={handleReset}
                className="btn-secondary px-6 py-2"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.search && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Search: "{filters.search}"
            </span>
          )}
          {filters.role !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Role: {filters.role}
            </span>
          )}
          {filters.dateRange !== '30days' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 