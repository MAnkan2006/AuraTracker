import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, // Used for cancelling
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Yes, I'm sure",
  cancelText = "Cancel",
  type = "danger" // 'danger' or 'warning' or 'info'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6 p-2">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${type === 'danger' ? 'bg-red-500/10 text-red-500' : type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 text-sm leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 group-data-[scheme=light]:border-black/[0.08]">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/20 active:scale-95 transition-all"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md active:scale-95 hover:shadow-lg ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
