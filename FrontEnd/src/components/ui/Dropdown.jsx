import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Dropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value == value : opt == value
  );
  
  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder;

  return (
    <div className={`relative ${isOpen ? 'z-50' : 'z-10'} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all"
      >
        <span className={!selectedOption ? "text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 font-medium" : "font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900"}>
          {displayValue}
        </span>
        <ChevronDown size={18} className={`text-[var(--accent)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 w-full mt-2 py-2 bg-[var(--card-bg)] group-data-[scheme=light]:bg-white border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200 rounded-2xl shadow-2xl backdrop-blur-2xl group-data-[scheme=light]:shadow-[0_12px_40px_rgba(0,0,0,0.2)] origin-top animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 group-data-[scheme=light]:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          {options.map((opt, idx) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = value == optValue;
            const customClass = typeof opt === 'object' && opt.className ? opt.className : '';
            
            return (
              <button
                key={idx}
                type="button"
                data-font={optValue && optValue.startsWith('font-') ? optValue : undefined}
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  isSelected 
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:text-blue-700' 
                    : 'text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-50'
                } ${customClass}`}
              >
                <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'} ${customClass.includes('font-bold') ? 'font-bold' : ''}`}>
                  {optLabel}
                </span>
                {isSelected && <Check size={16} className="text-[var(--accent)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
