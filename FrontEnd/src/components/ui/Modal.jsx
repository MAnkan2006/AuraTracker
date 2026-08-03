import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 group-data-[scheme=light]:bg-black/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-lg bg-[var(--popover-bg,#121420)] group-data-[scheme=light]:bg-white backdrop-blur-2xl border border-white/20 group-data-[scheme=light]:border-gray-200 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] group-data-[scheme=light]:shadow-2xl transform transition-all flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 group-data-[scheme=light]:border-gray-100">
          <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 group-data-[scheme=light]:bg-gray-100 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200 text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 group-data-[scheme=light]:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
