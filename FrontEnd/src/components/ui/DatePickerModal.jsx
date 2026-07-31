import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DatePickerModal = ({ isOpen, onClose, onConfirm, initialDate = '', title = 'Select Date' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      if (initialDate) {
        setCurrentDate(new Date(initialDate + "T12:00:00"));
      } else {
        setCurrentDate(new Date());
      }
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 15));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 15));
  };

  const handleSelectDate = (day) => {
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onConfirm(`${yyyy}-${mm}-${dd}`);
  };

  // Generate calendar grid
  const renderDays = () => {
    const days = [];
    
    // Empty cells
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Day cells
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      let isSelected = false;
      if (initialDate) {
        const initD = new Date(initialDate + "T12:00:00");
        isSelected = i === initD.getDate() && currentMonth === initD.getMonth() && currentYear === initD.getFullYear();
      }

      let btnClass = "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ";
      
      if (isSelected) {
        btnClass += "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)] scale-110";
      } else if (isToday) {
        btnClass += "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 group-data-[scheme=light]:border-[var(--accent)]/50 hover:bg-[var(--accent)]/30";
      } else {
        btnClass += "text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-100 hover:scale-110";
      }

      days.push(
        <button 
          key={i} 
          onClick={() => handleSelectDate(i)}
          className={btnClass}
        >
          {i}
        </button>
      );
    }
    
    return days;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col select-none">
        {/* Header (Month & Year) */}
        <div className="flex items-center justify-between mb-6 bg-[var(--accent)]/10 group-data-[scheme=light]:bg-blue-50 p-4 rounded-2xl">
          <button 
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 hover:bg-white/10 group-data-[scheme=light]:hover:bg-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">
              {monthNames[currentMonth]}
            </span>
            <span className="text-lg font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500">
              {currentYear}
            </span>
          </div>

          <button 
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 hover:bg-white/10 group-data-[scheme=light]:hover:bg-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 place-items-center mb-4">
          {renderDays()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-[var(--card-border)] group-data-[scheme=light]:border-gray-200 mt-2">
          <button 
            type="button"
            className="px-6 py-2 bg-white/5 group-data-[scheme=light]:bg-white text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 font-bold rounded-xl border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => {
              const d = new Date();
              handleSelectDate(d.getDate());
            }}
          >
            Today
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
