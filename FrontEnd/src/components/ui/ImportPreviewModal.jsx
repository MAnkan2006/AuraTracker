import React, { useState } from 'react';
import Modal from './Modal';
import { Trash2, CheckCircle2, Clock, BookOpen, FlaskConical, GraduationCap, AlertTriangle } from 'lucide-react';

const TYPE_CONFIG = {
  theory:   { label: 'Theory',   icon: BookOpen,      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:text-blue-600 group-data-[scheme=light]:border-blue-200' },
  lab:      { label: 'Lab',      icon: FlaskConical,  color: 'bg-green-500/10 text-green-400 border-green-500/20 group-data-[scheme=light]:bg-green-50 group-data-[scheme=light]:text-green-600 group-data-[scheme=light]:border-green-200' },
  tutorial: { label: 'Tutorial', icon: GraduationCap, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-data-[scheme=light]:bg-amber-50 group-data-[scheme=light]:text-amber-600 group-data-[scheme=light]:border-amber-200' },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Shows the classes Gemini extracted from the PDF so the user can
 * review and optionally remove individual entries before confirming.
 *
 * Props:
 *   isOpen       {boolean}
 *   classes      {Array}   – extracted classes from the AI
 *   warnings     {Array}   – validation warnings from the backend
 *   onConfirm    {fn}      – called with the final (possibly pruned) class array
 *   onClose      {fn}
 *   isLoading    {boolean} – true while the confirm API call is in-flight
 */
const ImportPreviewModal = ({ isOpen, classes = [], warnings = [], onConfirm, onClose, isLoading = false }) => {
  const [pending, setPending] = useState(classes);

  // Sync external classes into local state when modal opens/classes change
  React.useEffect(() => {
    setPending(classes);
  }, [classes]);

  const handleRemove = (id) => {
    setPending(prev => prev.filter(c => c.id !== id));
  };

  // Group by day for display
  const grouped = DAYS.reduce((acc, day) => {
    const dayClasses = pending.filter(c => c.day === day);
    if (dayClasses.length > 0) acc[day] = dayClasses;
    return acc;
  }, {});

  const TypeIcon = ({ type }) => {
    const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.theory;
    const Icon = cfg.icon;
    return <Icon size={11} />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Extracted Classes">
      <div className="space-y-5">

        {/* Summary bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--accent)]/10 group-data-[scheme=light]:bg-blue-50 rounded-2xl border border-[var(--accent)]/20 group-data-[scheme=light]:border-blue-100">
          <span className="text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800">
            {pending.length} class{pending.length !== 1 ? 'es' : ''} extracted
          </span>
          <span className="text-xs text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 font-medium">
            Remove any incorrect entries below
          </span>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 group-data-[scheme=light]:bg-amber-50 rounded-2xl border border-amber-500/20 group-data-[scheme=light]:border-amber-200">
            <AlertTriangle size={16} className="text-amber-400 group-data-[scheme=light]:text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {warnings.slice(0, 4).map((w, i) => (
                <p key={i} className="text-xs text-amber-400 group-data-[scheme=light]:text-amber-700 font-medium leading-snug">{w}</p>
              ))}
              {warnings.length > 4 && (
                <p className="text-xs text-amber-400/70 group-data-[scheme=light]:text-amber-500 font-medium">+{warnings.length - 4} more warnings</p>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {pending.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 italic font-medium">
            All classes removed. Add some back or cancel.
          </div>
        )}

        {/* Classes grouped by day */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, dayClasses]) => (
            <div key={day}>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mb-2 px-1">
                {day}
              </h4>
              <div className="space-y-2">
                {dayClasses.map(cls => {
                  const typeCfg = TYPE_CONFIG[cls.type] || TYPE_CONFIG.theory;
                  return (
                    <div
                      key={cls.id}
                      className="flex items-center gap-3 p-3 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-xl border border-white/10 group-data-[scheme=light]:border-gray-200 group hover:bg-white/8 transition-colors"
                    >
                      {/* Type badge */}
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border shrink-0 ${typeCfg.color}`}>
                        <TypeIcon type={cls.type} />
                        {typeCfg.label}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 truncate leading-tight">
                          {cls.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500">
                            <Clock size={10} />
                            {cls.startTime} – {cls.endTime}
                          </span>
                          {cls.room && (
                            <span className="text-[10px] font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 bg-white/5 group-data-[scheme=light]:bg-gray-100 px-1.5 py-0.5 rounded-md border border-white/10 group-data-[scheme=light]:border-gray-200 truncate max-w-[120px]">
                              {cls.room}
                            </span>
                          )}
                          {cls.faculty && (
                            <span className="text-[10px] text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 truncate max-w-[100px]">
                              {cls.faculty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(cls.id)}
                        title="Remove this class"
                        className="shrink-0 p-1.5 rounded-lg text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 group-data-[scheme=light]:border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pending)}
            disabled={isLoading || pending.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--accent)] hover:opacity-90 shadow-md shadow-[var(--accent-glow)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Confirm & Save
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportPreviewModal;
