import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Clock, Sparkles } from 'lucide-react';
import TimePickerModal from './TimePickerModal';
import { useRoutine } from '../../hooks/useRoutine';

const ReplacementClassModal = ({
  isOpen,
  onClose,
  subject = '',
  cancelledDate = '',
  defaultStart = '09:00',
  defaultEnd = '10:00',
  defaultRoom = '',
  onSave
}) => {
  const { routine } = useRoutine();
  const existingSubjects = Array.from(new Set((routine || []).map(c => c.title).filter(Boolean)));
  if (subject && !existingSubjects.includes(subject)) {
    existingSubjects.unshift(subject);
  }

  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState(subject);
  const [replacementDate, setReplacementDate] = useState(getTodayStr());
  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [room, setRoom] = useState(defaultRoom);
  const [activeTimePicker, setActiveTimePicker] = useState(null);

  const handleSubjectChange = (newSubject) => {
    setTitle(newSubject);
    if (!newSubject) return;

    // Search existing routine for a matching class to autofill start time, end time, and room
    const matchingClass = (routine || []).find(
      c => c.title && c.title.trim().toLowerCase() === newSubject.trim().toLowerCase()
    );

    if (matchingClass) {
      if (matchingClass.start) setStartTime(matchingClass.start);
      if (matchingClass.end) setEndTime(matchingClass.end);
      if (matchingClass.room) setRoom(matchingClass.room);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTitle(subject || '');
      setStartTime(defaultStart || '09:00');
      setEndTime(defaultEnd || '10:00');
      setRoom(defaultRoom || '');
      setReplacementDate(getTodayStr());
    }
  }, [isOpen, subject, cancelledDate, defaultStart, defaultEnd, defaultRoom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !replacementDate || !startTime || !endTime) return;

    onSave({
      title,
      start: startTime,
      end: endTime,
      room: room.trim(),
      date: replacementDate,
      isSpecial: true,
      isReplacement: true,
      replacesDate: cancelledDate,
      replacesSubject: subject
    });

    onClose();
  };

  const inputClass = "w-full p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all";
  const labelClass = "block text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 uppercase tracking-wider mb-2";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Schedule Replacement Class">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Header Info Banner */}
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-data-[scheme=light]:bg-purple-50 group-data-[scheme=light]:text-purple-700 group-data-[scheme=light]:border-purple-200 flex items-start gap-3">
            <Sparkles size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Replacement Provision:</span> Scheduling a makeup class replacing <strong className="underline">{subject || 'Cancelled Class'}</strong> {cancelledDate ? `from ${cancelledDate}` : ''}. You can choose the same subject or another subject for this slot.
            </div>
          </div>

          {/* Subject Title */}
          <div>
            <label className={labelClass}>Replacement Subject / Class Title</label>
            {existingSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {existingSubjects.map((sub, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSubjectChange(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      title === sub 
                        ? 'bg-[var(--accent)] text-white shadow-sm scale-105' 
                        : 'bg-white/5 group-data-[scheme=light]:bg-gray-100 text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-700 hover:bg-white/10'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              className={inputClass}
              value={title}
              onChange={(e) => handleSubjectChange(e.target.value)}
              placeholder="Enter or select subject..."
              required
            />
          </div>

          {/* Replacement Date */}
          <div>
            <label className={labelClass}>Replacement Class Date</label>
            <div className="relative">
              <input
                type="date"
                className={inputClass}
                value={replacementDate}
                onChange={(e) => setReplacementDate(e.target.value)}
                required
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mt-1">
              Select any date — sooner (before) or later than the cancelled class date.
            </p>
          </div>

          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Time</label>
              <button
                type="button"
                className={`${inputClass} flex items-center justify-between text-left`}
                onClick={() => setActiveTimePicker('start')}
              >
                <span>{startTime}</span>
                <Clock size={18} className="text-[var(--accent)] opacity-70" />
              </button>
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <button
                type="button"
                className={`${inputClass} flex items-center justify-between text-left`}
                onClick={() => setActiveTimePicker('end')}
              >
                <span>{endTime}</span>
                <Clock size={18} className="text-[var(--accent)] opacity-70" />
              </button>
            </div>
          </div>

          {/* Room */}
          <div>
            <label className={labelClass}>Room / Location (Optional)</label>
            <div className="relative">
              <input
                type="text"
                className={inputClass}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Lab 204 or Online"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-white/5 group-data-[scheme=light]:bg-gray-100 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200 text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-700 font-bold rounded-2xl transition-all"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_4px_15px_rgba(147,51,234,0.3)] hover:-translate-y-0.5"
            >
              Save Replacement
            </button>
          </div>
        </form>
      </Modal>

      {/* Time Picker Modal */}
      <TimePickerModal
        isOpen={activeTimePicker !== null}
        onClose={() => setActiveTimePicker(null)}
        initialTime={activeTimePicker === 'start' ? startTime : endTime}
        title={activeTimePicker === 'start' ? "Select Replacement Start Time" : "Select Replacement End Time"}
        onConfirm={(timeStr) => {
          if (activeTimePicker === 'start') setStartTime(timeStr);
          if (activeTimePicker === 'end') setEndTime(timeStr);
          setActiveTimePicker(null);
        }}
      />
    </>
  );
};

export default ReplacementClassModal;
