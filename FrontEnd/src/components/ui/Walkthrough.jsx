import React, { useState, useEffect } from 'react';

const steps = [
  {
    selector: '[data-tour="profile"]',
    title: 'Welcome to AuraTracker!',
    content: 'Your Profile is your central hub for account settings, target goals, and data management.',
    position: 'right'
  },
  {
    selector: '[data-tour="attendance"]',
    title: 'Attendance Dashboard',
    content: 'Track your real-time statistics and watch your progress bar fill up towards your Target Goal!',
    position: 'right'
  },
  {
    selector: '[data-tour="tasks"]',
    title: 'Task Management',
    content: 'Stay organized with your To-Do list. Filter tasks by category and track your productivity.',
    position: 'right'
  },
  {
    selector: '[data-tour="theme"]',
    title: 'Customize Your Vibe',
    content: 'Toggle between stunning glassmorphic themes and typography layouts instantly.',
    position: 'bottom'
  }
];

const Walkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetStyle, setTargetStyle] = useState({});

  useEffect(() => {
    // Only show once
    if (localStorage.getItem('is_first_signup') === 'true') {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      const el = document.querySelector(steps[currentStep].selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetStyle({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        
        // Optional: simulate click if tab needs opening (like tasks/attendance)
        // But for a simple tour, just pointing is enough.
      }
    }
  }, [isVisible, currentStep]);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.removeItem('is_first_signup'); // Mark complete
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity pointer-events-auto" onClick={handleClose} />
      
      {/* Highlight Box */}
      {targetStyle.width && (
        <div 
          className="absolute border-2 border-[var(--accent)] rounded-xl shadow-[0_0_20px_var(--accent-glow)] transition-all duration-500 ease-in-out pointer-events-none"
          style={{
            top: targetStyle.top - 8,
            left: targetStyle.left - 8,
            width: targetStyle.width + 16,
            height: targetStyle.height + 16
          }}
        />
      )}

      {/* Popover */}
      {targetStyle.width && (
        <div 
          className="absolute bg-[var(--card-bg)] group-data-[scheme=light]:bg-white border border-[var(--card-border)] p-5 rounded-2xl shadow-2xl transition-all duration-500 w-72 pointer-events-auto"
          style={{
            top: step.position === 'bottom' ? targetStyle.top + targetStyle.height + 16 : targetStyle.top,
            left: step.position === 'right' ? targetStyle.left + targetStyle.width + 24 : targetStyle.left - 300,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider">Step {currentStep + 1} of {steps.length}</span>
            <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">✕</button>
          </div>
          <h3 className="font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1">{step.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 mb-4 leading-relaxed">{step.content}</p>
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-bold shadow-[0_4px_10px_var(--accent-glow)] hover:-translate-y-0.5 transition-all"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Walkthrough;
