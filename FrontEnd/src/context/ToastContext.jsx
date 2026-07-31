import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  
  // Keep track of timeouts so we can pause them
  const timeouts = useRef(new Map());

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove after 4s
    const timeout = setTimeout(() => {
      removeToast(id);
    }, 4000);
    
    timeouts.current.set(id, timeout);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timeouts.current.has(id)) {
      clearTimeout(timeouts.current.get(id));
      timeouts.current.delete(id);
    }
  }, []);

  // Handle pausing/resuming timeouts on hover
  const onMouseEnter = (id) => {
    setHoveredId(id);
    if (timeouts.current.has(id)) {
      clearTimeout(timeouts.current.get(id));
    }
  };

  const onMouseLeave = (id) => {
    setHoveredId(null);
    const timeout = setTimeout(() => {
      removeToast(id);
    }, 2000); // give them 2s more after hover
    timeouts.current.set(id, timeout);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          let icon = <Info size={20} className="text-blue-500" />;
          let bgClass = "bg-[var(--card-bg)] border-[var(--card-border)] group-data-[scheme=light]:bg-white group-data-[scheme=light]:border-gray-200";
          
          if (toast.type === 'success') {
            icon = <CheckCircle2 size={20} className="text-green-500" />;
            bgClass = "bg-green-500/10 border-green-500/20 group-data-[scheme=light]:bg-green-50 group-data-[scheme=light]:border-green-200";
          } else if (toast.type === 'error') {
            icon = <AlertTriangle size={20} className="text-red-500" />;
            bgClass = "bg-red-500/10 border-red-500/20 group-data-[scheme=light]:bg-red-50 group-data-[scheme=light]:border-red-200";
          }
          
          return (
            <div 
              key={toast.id}
              className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-xl max-w-sm pointer-events-auto transform transition-all duration-300 animate-in slide-in-from-right-8 fade-in ${bgClass} ${hoveredId === toast.id ? '-translate-y-1 scale-[1.02]' : ''}`}
              onMouseEnter={() => onMouseEnter(toast.id)}
              onMouseLeave={() => onMouseLeave(toast.id)}
            >
              <div className="shrink-0">{icon}</div>
              <div className="flex-1 text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 pr-4">
                {toast.message}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-lg text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
