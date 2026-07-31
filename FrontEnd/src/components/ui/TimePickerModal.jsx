import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';

const TimePickerModal = ({ isOpen, onClose, onConfirm, initialTime = '09:00', title = 'Select Time' }) => {
  const [mode, setMode] = useState('hour'); // 'hour' | 'minute'
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [isPM, setIsPM] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef(null);

  // Initialize from 24h format "HH:mm"
  useEffect(() => {
    if (isOpen && initialTime) {
      const [h, m] = initialTime.split(':').map(Number);
      setIsPM(h >= 12);
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;
      setHour(hour12);
      setMinute(m || 0);
      setMode('hour');
    }
  }, [isOpen, initialTime]);

  const handleDialEvent = (e) => {
    if (!clockRef.current) return;
    
    // Support both mouse and touch events
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = clockRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let degrees = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;

    if (mode === 'hour') {
      let h = Math.round(degrees / 30);
      if (h === 0) h = 12;
      setHour(h);
    } else {
      let m = Math.round(degrees / 6);
      if (m === 60) m = 0;
      setMinute(m);
    }
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    handleDialEvent(e);
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      handleDialEvent(e);
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (mode === 'hour') {
      setMode('minute');
    }
  };

  const handleConfirm = () => {
    let h24 = hour;
    if (isPM && h24 !== 12) h24 += 12;
    if (!isPM && h24 === 12) h24 = 0;
    
    const hStr = h24.toString().padStart(2, '0');
    const mStr = minute.toString().padStart(2, '0');
    onConfirm(`${hStr}:${mStr}`);
  };

  if (!isOpen) return null;

  // Hand rotation
  const handRotation = mode === 'hour' ? hour * 30 : minute * 6;
  const numbers = mode === 'hour' 
    ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center">
        
        {/* Header Display */}
        <div className="flex items-end justify-center gap-4 w-full bg-[var(--accent)]/10 group-data-[scheme=light]:bg-blue-50 p-6 rounded-3xl mb-8">
          <div className="flex items-baseline gap-2">
            <button 
              className={`text-5xl font-bold font-[var(--font-heading)] rounded-xl px-2 transition-colors ${mode === 'hour' ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--text-primary)]/70 group-data-[scheme=light]:text-gray-500 hover:bg-white/5'}`}
              onClick={() => setMode('hour')}
            >
              {hour.toString().padStart(2, '0')}
            </button>
            <span className="text-5xl font-bold text-[var(--text-primary)]/70 group-data-[scheme=light]:text-gray-500 mb-1">:</span>
            <button 
              className={`text-5xl font-bold font-[var(--font-heading)] rounded-xl px-2 transition-colors ${mode === 'minute' ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--text-primary)]/70 group-data-[scheme=light]:text-gray-500 hover:bg-white/5'}`}
              onClick={() => setMode('minute')}
            >
              {minute.toString().padStart(2, '0')}
            </button>
          </div>

          <div className="flex flex-col gap-1 rounded-xl border border-white/10 group-data-[scheme=light]:border-gray-200 overflow-hidden text-sm font-bold bg-[var(--card-bg)] group-data-[scheme=light]:bg-white">
            <button 
              className={`px-3 py-1.5 transition-colors ${!isPM ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-50'}`}
              onClick={() => setIsPM(false)}
            >
              AM
            </button>
            <button 
              className={`px-3 py-1.5 transition-colors ${isPM ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-50'}`}
              onClick={() => setIsPM(true)}
            >
              PM
            </button>
          </div>
        </div>

        {/* Circular Dial */}
        <div 
          ref={clockRef}
          className="relative w-64 h-64 rounded-full bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-gray-200 shadow-inner select-none touch-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onMouseDown}
          onTouchMove={onMouseMove}
          onTouchEnd={onMouseUp}
        >
          {/* Center Dot */}
          <div className="absolute w-2 h-2 rounded-full bg-[var(--accent)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"></div>

          {/* Clock Hand */}
          <div 
            className="absolute left-1/2 bottom-1/2 w-0.5 bg-[var(--accent)] origin-bottom z-10 transition-transform duration-100 ease-out"
            style={{ height: '100px', transform: `translateX(-50%) rotate(${handRotation}deg)` }}
          >
            {/* End Dot */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm shadow-md">
              <span style={{ transform: `rotate(${-handRotation}deg)` }}>
                {mode === 'hour' ? hour : (minute === 0 ? '00' : minute)}
              </span>
            </div>
          </div>

          {/* Numbers */}
          {numbers.map((num, i) => {
            const angle = i * 30 - 90;
            const radius = 100;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            const isActive = (mode === 'hour' && hour === num) || (mode === 'minute' && minute === num);

            return (
              <div 
                key={num}
                className={`absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center rounded-full text-sm font-bold z-0 pointer-events-none transition-colors duration-200 ${isActive ? 'text-white' : 'text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700'}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`
                }}
              >
                {mode === 'minute' && num === 0 ? '00' : num}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3 mt-10">
          <button 
            className="flex-1 py-3.5 rounded-2xl font-bold border border-white/10 group-data-[scheme=light]:border-gray-200 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-50 transition-colors text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="flex-1 py-3.5 bg-[var(--accent)] hover:opacity-90 text-white font-bold rounded-2xl shadow-[0_4px_15px_var(--accent-glow)] transition-all hover:-translate-y-0.5"
            onClick={handleConfirm}
          >
            OK
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default TimePickerModal;
