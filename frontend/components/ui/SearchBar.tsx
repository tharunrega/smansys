'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  debounceTime?: number;
}

export default function SearchBar({
  initialValue = '',
  placeholder = 'Search...',
  onSearch,
  className = '',
  debounceTime = 300,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div 
      className={`flex items-center px-3 py-2 rounded-md border transition-all ${
        isFocused ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200'
      } ${className}`}
    >
      <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 outline-none border-none text-sm bg-transparent"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchTerm && (
        <button 
          onClick={clearSearch} 
          className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
