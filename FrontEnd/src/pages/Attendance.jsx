import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useRoutine } from '../hooks/useRoutine';
import { CheckCircle2, XCircle, Clock, FileWarning, AlertCircle, ChevronLeft, ChevronRight, Info, Ban, Sparkles } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Dropdown from '../components/ui/Dropdown';

const Attendance = () => {
  const { attendance, markAttendance, getStats } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingDate, setEditingDate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { routine } = useRoutine();
  
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const overallStats = getStats();
  
  // Extract unique subjects from routine
  const subjects = Array.from(new Set(routine.map(c => c.title))).filter(Boolean);
  
  const glassPanelClass = "bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-data-[scheme=light]:shadow-sm transition-all duration-300";

  const isSubjectSelected = Boolean(selectedSubject);

  const getSubjectStats = (subject) => {
    if (!subject || !attendance[subject]) return null;
    const records = attendance[subject];
    let present = 0, absent = 0, late = 0, excused = 0, cancelled = 0;
    Object.values(records).forEach(status => {
      if (status === 'Present' || status === 'p') present++;
      else if (status === 'Absent' || status === 'a') absent++;
      else if (status === 'Late' || status === 'l') late++;
      else if (status === 'Excused' || status === 'e') excused++;
      else if (status === 'Cancelled' || status === 'c') cancelled++;
    });
    const total = present + absent + late;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, excused, cancelled, total, percentage };
  };

  const activeSubjectStats = selectedSubject ? getSubjectStats(selectedSubject) : null;
  const displayStats = activeSubjectStats || overallStats;

  const getDaysForSubject = (subj) => {
    if (!subj) return [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysSet = new Set();
    routine.filter(c => c.title === subj).forEach(c => {
      if (c.isSpecial) {
        daysSet.add('Special Dates');
      } else if (c.day >= 1 && c.day <= 7) {
        daysSet.add(dayNames[c.day - 1]);
      }
    });
    return Array.from(daysSet);
  };

  const isClassDayForSubject = (subj, dateStr) => {
    if (!subj || !dateStr) return false;
    const d = new Date(dateStr + "T12:00:00");
    const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay(); // 1=Mon .. 7=Sun
    
    return routine.some(c => {
      if (c.title !== subj) return false;
      if (c.isSpecial) {
        return c.date === dateStr;
      }
      return c.day === dayOfWeek;
    });
  };

  const handleMark = (status) => {
    if (!selectedSubject) {
      setAlertMessage("Please select a subject first from the dropdown before marking attendance.");
      setIsAlertOpen(true);
      return;
    }
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    markAttendance(selectedSubject, todayStr, status);
    
    setAlertMessage(`Successfully marked as ${status} for ${selectedSubject}!`);
    setIsAlertOpen(true);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 md:p-4 rounded-xl border border-transparent"></div>);
    }
    
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      const hasClassToday = isClassDayForSubject(selectedSubject, dateKey);
      const status = selectedSubject && attendance[selectedSubject] ? attendance[selectedSubject][dateKey] : null;
      
      let statusClass = "bg-white/5 group-data-[scheme=light]:bg-gray-50 border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900";
      
      if (status === 'Present') statusClass = "bg-green-500/20 border-green-500/30 text-green-500 group-data-[scheme=light]:text-green-700 font-bold";
      else if (status === 'Absent') statusClass = "bg-red-500/20 border-red-500/30 text-red-500 group-data-[scheme=light]:text-red-700 font-bold";
      else if (status === 'Late') statusClass = "bg-yellow-500/20 border-yellow-500/30 text-yellow-500 group-data-[scheme=light]:text-yellow-700 font-bold";
      else if (status === 'Excused') statusClass = "bg-blue-500/20 border-blue-500/30 text-blue-500 group-data-[scheme=light]:text-blue-700 font-bold";
      else if (status === 'Cancelled') statusClass = "bg-gray-500/20 border-gray-500/30 text-gray-400 group-data-[scheme=light]:text-gray-600 font-bold";
      
      if (!hasClassToday) {
        days.push(
          <div 
            key={`day-${i}`} 
            title={`No class scheduled for ${selectedSubject} on this day`}
            className="p-2 md:p-4 rounded-xl border border-white/5 group-data-[scheme=light]:border-gray-200/50 flex items-center justify-center bg-white/[0.02] group-data-[scheme=light]:bg-gray-100/40 text-[var(--text-muted)] opacity-30 cursor-not-allowed select-none"
          >
            {i}
          </div>
        );
      } else {
        days.push(
          <div 
            key={`day-${i}`} 
            onClick={() => {
              setEditingDate(dateKey);
              setIsEditModalOpen(true);
            }}
            title={`Click to edit attendance for ${selectedSubject} on ${dateKey}`}
            className={`p-2 md:p-4 rounded-xl border flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${statusClass} ${isToday ? 'ring-2 ring-[var(--accent)] shadow-md' : ''}`}
          >
            {i}
          </div>
        );
      }
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const subjectScheduleDays = getDaysForSubject(selectedSubject);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">Class Attendance</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Log and track your subject-wise presence.</p>
        </div>
      </div>

      <div className={glassPanelClass}>
        <div className="mb-6">
          <label className="block text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-3 uppercase tracking-wider">Select Subject</label>
          <Dropdown
            className="w-full md:w-1/2"
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={subjects}
            placeholder="-- Choose Class --"
          />
        </div>

        {/* Action buttons or Placeholder Notice */}
        {!isSubjectSelected ? (
          <div className="p-8 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-dashed border-white/10 group-data-[scheme=light]:border-gray-300 text-center flex flex-col items-center justify-center">
            <Sparkles size={32} className="text-[var(--accent)] mb-3 animate-bounce opacity-80" />
            <h4 className="font-bold text-lg text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800">Select a Subject to Mark Attendance</h4>
            <p className="text-sm text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mt-1 max-w-md">
              Choose a subject from the dropdown above to unlock the attendance logger and view the subject calendar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button 
              className="group flex flex-col items-center justify-center p-6 bg-white/5 group-data-[scheme=light]:bg-green-50 text-green-400 group-data-[scheme=light]:text-green-700 rounded-2xl border border-white/10 group-data-[scheme=light]:border-green-200 hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleMark('Present')}
            >
              <CheckCircle2 size={36} className="mb-3 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-wide">Present</span>
            </button>
            
            <button 
              className="group flex flex-col items-center justify-center p-6 bg-white/5 group-data-[scheme=light]:bg-red-50 text-red-400 group-data-[scheme=light]:text-red-700 rounded-2xl border border-white/10 group-data-[scheme=light]:border-red-200 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleMark('Absent')}
            >
              <XCircle size={36} className="mb-3 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-wide">Absent</span>
            </button>
            
            <button 
              className="group flex flex-col items-center justify-center p-6 bg-white/5 group-data-[scheme=light]:bg-yellow-50 text-yellow-400 group-data-[scheme=light]:text-yellow-700 rounded-2xl border border-white/10 group-data-[scheme=light]:border-yellow-200 hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleMark('Late')}
            >
              <Clock size={36} className="mb-3 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-wide">Late</span>
            </button>
            
            <button 
              className="group flex flex-col items-center justify-center p-6 bg-white/5 group-data-[scheme=light]:bg-blue-50 text-[var(--accent)] group-data-[scheme=light]:text-blue-700 rounded-2xl border border-white/10 group-data-[scheme=light]:border-blue-200 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleMark('Excused')}
            >
              <FileWarning size={36} className="mb-3 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-wide">Excused</span>
            </button>
            
            <button 
              className="group flex flex-col items-center justify-center p-6 bg-white/5 group-data-[scheme=light]:bg-gray-100 text-gray-400 group-data-[scheme=light]:text-gray-600 rounded-2xl border border-white/10 group-data-[scheme=light]:border-gray-300 hover:border-gray-500/50 hover:bg-gray-500/10 hover:shadow-[0_0_20px_rgba(156,163,175,0.2)] transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleMark('Cancelled')}
            >
              <Ban size={36} className="mb-3 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-wide">Cancelled</span>
            </button>
          </div>
        )}
      </div>

      {/* Metric Stats Grid (Always shown) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={glassPanelClass}>
          <div className="text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">
            {selectedSubject ? `${selectedSubject} Rate` : 'Overall Attendance Rate'}
          </div>
          <div className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-4">{displayStats.percentage}%</div>
          <div className="w-full bg-white/10 group-data-[scheme=light]:bg-gray-200 rounded-full h-2 shadow-inner">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${displayStats.percentage}%` }}></div>
          </div>
        </div>
        
        <div className={glassPanelClass}>
          <div className="text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">Logged Classes</div>
          <div className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1">{displayStats.total} logs</div>
          <div className="text-sm font-medium text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">
            {selectedSubject ? `Total recorded for ${selectedSubject}` : 'Total recorded across all classes'}
          </div>
        </div>
        
        <div className={glassPanelClass}>
          <div className="text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">Class Schedule</div>
          <div className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-2 truncate">
            {selectedSubject ? (subjectScheduleDays.length > 0 ? subjectScheduleDays.join(', ') : 'No scheduled days') : 'Select a subject'}
          </div>
          <div className="text-sm font-medium text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">
            {selectedSubject ? 'Weekly routine schedule' : 'Choose class to inspect schedule'}
          </div>
        </div>
      </div>

      {/* Stats Counters Row */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        <div className="px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 group-data-[scheme=light]:text-green-700 font-extrabold shadow-sm">
          P: {displayStats.present || 0}
        </div>
        <div className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-data-[scheme=light]:text-red-700 font-extrabold shadow-sm">
          A: {displayStats.absent || 0}
        </div>
        <div className="px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 group-data-[scheme=light]:text-yellow-700 font-extrabold shadow-sm">
          L: {displayStats.late || 0}
        </div>
        <div className="px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 group-data-[scheme=light]:text-blue-700 font-extrabold shadow-sm">
          E: {displayStats.excused || 0}
        </div>
        <div className="px-6 py-3 rounded-2xl bg-gray-500/10 border border-gray-500/20 text-gray-400 group-data-[scheme=light]:text-gray-600 font-extrabold shadow-sm">
          C: {displayStats.cancelled || 0}
        </div>
      </div>

      {/* Calendar Month View Grid (Hidden until subject is selected) */}
      {isSubjectSelected && (
        <div className={`${glassPanelClass} overflow-hidden`}>
          <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-100 transition-colors text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">
              <ChevronLeft size={24} />
            </button>
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">
              {monthNames[currentMonth]} {currentYear} &mdash; <span className="text-[var(--accent)]">{selectedSubject}</span>
            </h3>
            <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-100 transition-colors text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-3 mb-6 bg-[var(--accent)]/10 text-[var(--accent)] group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:text-blue-700 rounded-xl border border-[var(--accent)]/20 text-sm font-medium">
            <Info size={18} />
            <span>Clickable cells represent scheduled class days for {selectedSubject}.</span>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {renderCalendarDays()}
          </div>
        </div>
      )}

      <Modal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title="Attendance Status">
        <div className="flex flex-col items-center text-center py-4">
          <AlertCircle className={`w-16 h-16 mb-4 ${!selectedSubject ? 'text-yellow-500' : 'text-green-500'}`} />
          <p className="text-lg text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 font-medium">
            {alertMessage}
          </p>
          <button 
            onClick={() => setIsAlertOpen(false)}
            className="mt-6 px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Attendance: ${editingDate}`}>
        <div className="flex flex-col gap-3 py-2">
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 mb-2 font-medium">
            Select new status for <span className="font-bold text-[var(--accent)]">{selectedSubject}</span> on {editingDate}:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Present', color: 'text-green-500 group-data-[scheme=light]:text-green-700 bg-green-500/10 border-green-500/20 hover:bg-green-500/20' },
              { id: 'Absent', color: 'text-red-500 group-data-[scheme=light]:text-red-700 bg-red-500/10 border-red-500/20 hover:bg-red-500/20' },
              { id: 'Late', color: 'text-yellow-500 group-data-[scheme=light]:text-yellow-700 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20' },
              { id: 'Excused', color: 'text-blue-500 group-data-[scheme=light]:text-blue-700 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
              { id: 'Cancelled', color: 'text-gray-400 group-data-[scheme=light]:text-gray-600 bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20' },
            ].map(status => (
              <button
                key={status.id}
                onClick={() => {
                  markAttendance(selectedSubject, editingDate, status.id);
                  setIsEditModalOpen(false);
                  setAlertMessage(`Updated ${editingDate} to ${status.id}`);
                  setIsAlertOpen(true);
                }}
                className={`p-4 border rounded-xl font-bold transition-all ${status.color}`}
              >
                {status.id}
              </button>
            ))}
            <button
              onClick={() => {
                markAttendance(selectedSubject, editingDate, null);
                setIsEditModalOpen(false);
                setAlertMessage(`Cleared attendance for ${editingDate}`);
                setIsAlertOpen(true);
              }}
              className="p-4 border border-white/10 group-data-[scheme=light]:border-gray-300 rounded-xl font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-100 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Attendance;
