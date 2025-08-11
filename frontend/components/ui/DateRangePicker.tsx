'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = '',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate);
  
  // Generate calendar days
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: Date[] = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Get current month and year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const days = generateCalendarDays(currentYear, currentMonth);
  
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const handleDateClick = (date: Date) => {
    if (selectingStartDate) {
      setLocalStartDate(date);
      setLocalEndDate(undefined);
      setSelectingStartDate(false);
    } else {
      if (localStartDate && date < localStartDate) {
        setLocalStartDate(date);
        setLocalEndDate(localStartDate);
      } else {
        setLocalEndDate(date);
      }
      setSelectingStartDate(true);
      
      // If both dates are selected, apply the change
      if (localStartDate) {
        onChange(localStartDate, date);
      }
    }
  };
  
  const handleMouseEnter = (date: Date) => {
    if (!selectingStartDate) {
      setHoverDate(date);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverDate(null);
  };
  
  const isInRange = (date: Date) => {
    if (selectingStartDate || !localStartDate) return false;
    
    const compareDate = hoverDate || localEndDate;
    
    if (!compareDate) return false;
    
    return (
      date >= localStartDate &&
      date <= compareDate
    );
  };
  
  const isStartDate = (date: Date) => {
    return localStartDate && date.toDateString() === localStartDate.toDateString();
  };
  
  const isEndDate = (date: Date) => {
    return localEndDate && date.toDateString() === localEndDate.toDateString();
  };
  
  const dateToString = (date: Date | undefined) => {
    if (!date) return '';
    return format(date, 'MMM dd, yyyy');
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 hover:border-gray-300 focus:outline-none"
      >
        <CalendarIcon className="h-4 w-4 text-gray-500" />
        <span>
          {localStartDate && localEndDate
            ? `${dateToString(localStartDate)} - ${dateToString(localEndDate)}`
            : 'Select date range'}
        </span>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute mt-2 p-3 bg-white rounded-lg shadow-lg border z-50"
          style={{ width: '300px' }}
        >
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={previousMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="font-medium">
              {format(new Date(currentYear, currentMonth), 'MMMM yyyy')}
            </h3>
            <button 
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from(
              { length: new Date(currentYear, currentMonth, 1).getDay() },
              (_, i) => (
                <div key={`empty-${i}`} />
              )
            )}
            
            {days.map((day) => {
              const isSelected = isStartDate(day) || isEndDate(day);
              const inRange = isInRange(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => handleMouseEnter(day)}
                  onMouseLeave={handleMouseLeave}
                  className={`
                    p-1 text-center text-sm rounded
                    ${isSelected ? 'bg-blue-600 text-white' : ''}
                    ${inRange && !isSelected ? 'bg-blue-100' : ''}
                    ${!isSelected && !inRange ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onChange(localStartDate, localEndDate);
                setIsOpen(false);
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              disabled={!localStartDate || !localEndDate}
            >
              Apply
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
