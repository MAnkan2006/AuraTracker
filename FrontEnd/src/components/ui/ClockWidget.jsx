import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const { appState, updateAppState } = useContext(AppContext) || {};

  // Styles: 'stacked', 'analog', 'digital'
  const styles = ['stacked', 'analog', 'digital'];

  const currentSavedStyle = appState?.clockStyle || localStorage.getItem('aura_clock_style') || 'stacked';
  const initialIndex = Math.max(0, styles.indexOf(currentSavedStyle));

  const [styleIndex, setStyleIndex] = useState(initialIndex);

  useEffect(() => {
    if (appState?.clockStyle) {
      const idx = styles.indexOf(appState.clockStyle);
      if (idx !== -1) {
        setStyleIndex(prev => (prev === idx ? prev : idx));
      }
    }
  }, [appState?.clockStyle]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentStyle = styles[styleIndex];

  const handleToggleStyle = () => {
    const nextIdx = (styleIndex + 1) % styles.length;
    const nextStyle = styles[nextIdx];
    setStyleIndex(nextIdx);
    localStorage.setItem('aura_clock_style', nextStyle);
    if (updateAppState) {
      updateAppState({ clockStyle: nextStyle });
    }
  };

  const hoursStr = time.getHours().toString().padStart(2, '0');
  const minutesStr = time.getMinutes().toString().padStart(2, '0');
  const secondsStr = time.getSeconds().toString().padStart(2, '0');

  // Render Stacked (Android 12 Lockscreen Style)
  const renderStacked = () => (
    <div className="flex flex-col items-end leading-[0.8] tracking-tighter relative group/clock">
      <div className="absolute opacity-0 group-hover/clock:opacity-100 right-full mr-4 text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 whitespace-nowrap transition-opacity">
        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
      <div className="text-[4.5rem] font-black text-[var(--accent)]/90 drop-shadow-md group-data-[scheme=light]:text-[var(--accent-hover)] font-[var(--font-heading)]">
        {hoursStr}
      </div>
      <div className="text-[4.5rem] font-black text-[var(--text-primary)]/40 group-data-[scheme=light]:text-gray-900/40 font-[var(--font-heading)] -mt-2">
        {minutesStr}
      </div>
    </div>
  );

  // Render Digital Bold
  const renderDigital = () => (
    <div className="flex flex-col items-end justify-center h-full">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 tracking-tight font-[var(--font-heading)]">
          {hoursStr}:{minutesStr}
        </span>
        <span className="text-lg font-bold text-[var(--accent)] group-data-[scheme=light]:text-[var(--accent-hover)] w-6 text-right">
          {secondsStr}
        </span>
      </div>
      <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );

  // Render Analog Material Style
  const renderAnalog = () => {
    const secondHandRotation = time.getSeconds() * 6;
    const minuteHandRotation = time.getMinutes() * 6 + time.getSeconds() * 0.1;
    const hourHandRotation = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

    return (
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-lg font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)] mb-1">
             {time.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 uppercase tracking-widest">
            {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
        <div className="relative w-[5.5rem] h-[5.5rem] rounded-full bg-white/5 border-[4px] border-[var(--accent)]/30 group-data-[scheme=light]:bg-gray-100 group-data-[scheme=light]:border-[var(--accent)]/20 shadow-inner flex items-center justify-center">
          {/* Hour Hand */}
          <div 
            className="absolute w-1.5 h-6 bg-[var(--text-primary)] group-data-[scheme=light]:bg-gray-800 rounded-full origin-bottom"
            style={{ transform: `translateY(-50%) rotate(${hourHandRotation}deg)` }}
          />
          {/* Minute Hand */}
          <div 
            className="absolute w-1 h-[2.2rem] bg-[var(--text-secondary)] group-data-[scheme=light]:bg-gray-500 rounded-full origin-bottom"
            style={{ transform: `translateY(-50%) rotate(${minuteHandRotation}deg)` }}
          />
          {/* Second Hand (Dot) */}
          <div 
            className="absolute w-2.5 h-2.5 bg-[var(--accent)] rounded-full z-10 transition-transform duration-100 ease-linear"
            style={{ transform: `rotate(${secondHandRotation}deg) translateY(-32px)` }}
          />
          {/* Center Dot */}
          <div className="absolute w-2 h-2 bg-[var(--text-primary)] group-data-[scheme=light]:bg-gray-800 rounded-full z-20" />
        </div>
      </div>
    );
  };

  return (
    <div 
      onClick={handleToggleStyle}
      className="cursor-pointer group flex items-center justify-end select-none min-h-[100px] min-w-[120px] transition-transform hover:scale-[1.02] active:scale-95"
      title="Click to cycle clock styles"
    >
      {currentStyle === 'stacked' && renderStacked()}
      {currentStyle === 'digital' && renderDigital()}
      {currentStyle === 'analog' && renderAnalog()}
    </div>
  );
};

export default ClockWidget;
