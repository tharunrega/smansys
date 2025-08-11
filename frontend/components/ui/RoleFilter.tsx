'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

interface RoleOption {
  value: string;
  label: string;
}

interface RoleFilterProps {
  selectedRole: string;
  options: RoleOption[];
  onChange: (role: string) => void;
  className?: string;
}

export default function RoleFilter({
  selectedRole,
  options,
  onChange,
  className = '',
}: RoleFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === selectedRole) || options[0];
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full gap-2 px-3 py-2 rounded-md border border-gray-200 hover:border-gray-300 focus:outline-none bg-white"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span>{selectedOption.label}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
          >
            <ul className="py-1" role="listbox">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 ${
                      selectedRole === option.value ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    role="option"
                    aria-selected={selectedRole === option.value}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
