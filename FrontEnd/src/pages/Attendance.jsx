import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useRoutine } from '../hooks/useRoutine';
import { CheckCircle2, XCircle, Clock, FileWarning, AlertCircle, ChevronLeft, ChevronRight, Info, Ban, Sparkles, Calendar, BookOpen, Check, Eye, EyeOff, Layers, ArrowRight } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Dropdown from '../components/ui/Dropdown';

const Attendance = () => {
  const { attendance, markAttendance, getStats, sessionStartDateStr, isBeforeSessionStart } = useAttendance();
  const { routine } = useRoutine();

  // Sub-tab Navigation: 'mark' | 'register'
  const [activeTab, setActiveTab] = useState('mark');
  
  // Register tab selected subject ('')
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Alert and edit modals
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editingDate, setEditingDate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Toggle to view recorded today classes in Mark Attendance tab
  const [showRecordedToday, setShowRecordedToday] = useState(false);

  const currentDate = new Date();
  const currentHour = currentDate.getHours(); // 0 - 23 (4 PM is 16)
  
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  const overallStats = getStats();
  
  // Format today's date string YYYY-MM-DD
  const yearStr = currentDate.getFullYear();
  const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${yearStr}-${monthStr}-${dayStr}`;
  const todayDayNum = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // 1=Mon .. 7=Sun

  // Format tomorrow's date string YYYY-MM-DD
  const tomorrowDateObj = new Date(currentDate);
  tomorrowDateObj.setDate(currentDate.getDate() + 1);
  const tomorrowYearStr = tomorrowDateObj.getFullYear();
  const tomorrowMonthStr = String(tomorrowDateObj.getMonth() + 1).padStart(2, '0');
  const tomorrowDayStr = String(tomorrowDateObj.getDate()).padStart(2, '0');
  const tomorrowStr = `${tomorrowYearStr}-${tomorrowMonthStr}-${tomorrowDayStr}`;
  const tomorrowDayNum = tomorrowDateObj.getDay() === 0 ? 7 : tomorrowDateObj.getDay();

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const tomorrowDayName = dayNames[tomorrowDayNum - 1];
  
  // Extract unique subjects from routine
  const subjects = Array.from(new Set(routine.map(c => c.title))).filter(Boolean);
  
  const glassPanelClass = "bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-data-[scheme=light]:shadow-sm transition-all duration-300";

  // --- Today's Classes Logic for 'mark' tab ---
  const todayClasses = routine.filter(c => {
    if (c.isSpecial) return c.date === todayStr;
    return Number(c.day) === todayDayNum;
  });

  // Sort today's classes chronologically by start time
  const sortedTodayClasses = [...todayClasses].sort((a, b) => {
    const timeA = a.start || '00:00';
    const timeB = b.start || '00:00';
    return timeA.localeCompare(timeB);
  });

  // Unrecorded (pending) today classes vs Recorded today classes
  const pendingTodayClasses = sortedTodayClasses.filter(c => {
    const status = attendance[c.title]?.[todayStr];
    return !status;
  });

  const recordedTodayClasses = sortedTodayClasses.filter(c => {
    const status = attendance[c.title]?.[todayStr];
    return Boolean(status);
  });

  const nowHour = currentDate.getHours(); // 0 - 23 (4 PM is 16)
  const nowMin = currentDate.getMinutes();
  const nowHHMM = `${String(nowHour).padStart(2, '0')}:${String(nowMin).padStart(2, '0')}`;

  // Unrecorded today classes whose scheduled end time has not passed yet
  const remainingTodayClasses = sortedTodayClasses.filter(c => {
    const isMarked = Boolean(attendance[c.title]?.[todayStr]);
    const endTime = c.end || c.start || '23:59';
    const isTimePassed = endTime <= nowHHMM;
    return !isMarked && !isTimePassed;
  });

  // --- Tomorrow's Classes Logic ---
  const tomorrowClasses = routine.filter(c => {
    if (c.isSpecial) return c.date === tomorrowStr;
    return Number(c.day) === tomorrowDayNum;
  });

  const sortedTomorrowClasses = [...tomorrowClasses].sort((a, b) => {
    const timeA = a.start || '00:00';
    const timeB = b.start || '00:00';
    return timeA.localeCompare(timeB);
  });

  // Condition to switch Up Next to Tomorrow:
  // (After 4 PM (>=16) OR no remaining unrecorded classes for today) AND classes exist for tomorrow
  const isAfter4PM = nowHour >= 16;
  const noRemainingToday = remainingTodayClasses.length === 0;
  const showTomorrowUpNext = (isAfter4PM || noRemainingToday) && sortedTomorrowClasses.length > 0;

  // Active target date and classes to display in Up Next hero card
  let activeClassList = [];
  if (showTomorrowUpNext) {
    activeClassList = sortedTomorrowClasses;
  } else if (remainingTodayClasses.length > 0) {
    activeClassList = remainingTodayClasses;
  } else {
    activeClassList = pendingTodayClasses;
  }

  const primaryPendingClass = activeClassList[0] || null;
  const targetMarkDate = showTomorrowUpNext ? tomorrowStr : todayStr;

  // --- Subject Register Stats Logic for 'register' tab ---
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
    const dayNamesList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysSet = new Set();
    routine.filter(c => c.title === subj).forEach(c => {
      if (c.isSpecial) {
        daysSet.add('Special Dates');
      } else {
        const dayNum = Number(c.day);
        if (dayNum >= 1 && dayNum <= 7) {
          daysSet.add(dayNamesList[dayNum - 1]);
        }
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
      return Number(c.day) === dayOfWeek;
    });
  };

  const handleMarkClass = (subject, dateKey, status) => {
    if (isBeforeSessionStart(dateKey)) {
      setAlertMessage(`Cannot mark attendance for ${dateKey} as it is prior to your Session Start Date (${sessionStartDateStr}). You can update your Session Start Date in Profile settings.`);
      setIsAlertOpen(true);
      return;
    }

    markAttendance(subject, dateKey, status);
    setAlertMessage(`Marked ${subject} as ${status} for ${dateKey}!`);
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
      const isPriorToSessionStart = isBeforeSessionStart(dateKey);
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
      } else if (isPriorToSessionStart) {
        days.push(
          <div 
            key={`day-${i}`} 
            title={`Attendance disabled prior to Session Start Date (${sessionStartDateStr})`}
            className="p-2 md:p-4 rounded-xl border border-red-500/10 group-data-[scheme=light]:border-red-200/50 flex flex-col items-center justify-center bg-red-500/5 group-data-[scheme=light]:bg-red-50/30 text-red-400/70 group-data-[scheme=light]:text-red-600/70 opacity-50 cursor-not-allowed select-none"
          >
            <span className="font-bold">{i}</span>
            <Ban size={12} className="text-red-400 mt-1" />
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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">Class Attendance</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Log today's presence or inspect subject attendance registers.</p>
        </div>
        
        {sessionStartDateStr && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 group-data-[scheme=light]:bg-blue-50 border border-blue-500/20 group-data-[scheme=light]:border-blue-200 text-blue-400 group-data-[scheme=light]:text-blue-700 rounded-2xl text-xs font-bold shadow-sm self-start md:self-auto">
            <Calendar size={16} />
            <span>Session Start: <strong className="font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">{sessionStartDateStr}</strong></span>
          </div>
        )}
      </div>

      {/* Sub-tab Switcher (Mark Attendance vs Attendance Register) */}
      <div className="flex items-center bg-white/5 group-data-[scheme=light]:bg-gray-100 rounded-2xl p-1.5 border border-white/10 group-data-[scheme=light]:border-gray-200 shadow-sm w-fit">
        <button 
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'mark' ? 'bg-[var(--card-bg)] group-data-[scheme=light]:bg-white text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 shadow-sm border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200' : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-800'}`}
          onClick={() => setActiveTab('mark')}
        >
          <Clock size={18} />
          <span>Mark Attendance</span>
          {pendingTodayClasses.length > 0 && (
            <span className="px-2 py-0.5 text-xs bg-[var(--accent)] text-white font-extrabold rounded-full animate-pulse">
              {pendingTodayClasses.length}
            </span>
          )}
        </button>
        <button 
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'register' ? 'bg-[var(--card-bg)] group-data-[scheme=light]:bg-white text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 shadow-sm border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200' : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-800'}`}
          onClick={() => setActiveTab('register')}
        >
          <BookOpen size={18} />
          <span>Attendance Register</span>
        </button>
      </div>

      {/* TAB 1: MARK ATTENDANCE (Today / Tomorrow Logger) */}
      {activeTab === 'mark' && (
        <div className="space-y-6">
          {isBeforeSessionStart(todayStr) ? (
            <div className={glassPanelClass}>
              <div className="p-8 bg-amber-500/10 border border-amber-500/20 group-data-[scheme=light]:bg-amber-50 group-data-[scheme=light]:border-amber-200 rounded-2xl text-center flex flex-col items-center justify-center">
                <AlertCircle size={36} className="text-amber-400 mb-3" />
                <h4 className="font-bold text-lg text-amber-500 mb-1">Session Has Not Started Yet</h4>
                <p className="text-sm text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 max-w-md">
                  Today's date ({todayStr}) is prior to your Session Start Date ({sessionStartDateStr}). Attendance marking is disabled until your session begins.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* After 4 PM Tomorrow Banner Notice */}
              {showTomorrowUpNext && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 group-data-[scheme=light]:bg-purple-50 group-data-[scheme=light]:border-purple-200 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <Calendar size={22} className="text-purple-400 group-data-[scheme=light]:text-purple-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-purple-400 group-data-[scheme=light]:text-purple-700 text-sm flex items-center gap-2">
                        Today's Classes Complete &bull; Up Next Tomorrow ({tomorrowDayName}, {tomorrowStr})
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">
                        It's after 4:00 PM and all today's classes are logged. Previewing tomorrow's time-sorted schedule.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Today Completed Banner (when not showing tomorrow) */}
              {!showTomorrowUpNext && pendingTodayClasses.length === 0 && sortedTodayClasses.length > 0 && (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 group-data-[scheme=light]:bg-emerald-50 group-data-[scheme=light]:border-emerald-200 rounded-3xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-emerald-500 text-lg">All Classes Recorded for Today!</h4>
                      <p className="text-xs text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">You have logged all {sortedTodayClasses.length} scheduled classes for today ({todayStr}).</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRecordedToday(!showRecordedToday)}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 group-data-[scheme=light]:text-emerald-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    {showRecordedToday ? 'Hide Recorded' : 'View Recorded'}
                  </button>
                </div>
              )}

              {/* No classes scheduled today or tomorrow empty state */}
              {!primaryPendingClass && sortedTodayClasses.length === 0 && (
                <div className={glassPanelClass}>
                  <div className="p-12 text-center flex flex-col items-center justify-center">
                    <Sparkles size={40} className="text-[var(--accent)] mb-4 animate-bounce opacity-80" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1">No Classes Scheduled Today</h3>
                    <p className="text-sm text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 max-w-md">
                      You have no routine or special classes scheduled for today ({todayStr}). Enjoy your day off or review subject registers!
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Featured Class (Next Up Today or Next Up Tomorrow) */}
              {primaryPendingClass && (
                <div className={`${glassPanelClass} relative overflow-hidden ${showTomorrowUpNext ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-[var(--accent)]'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-extrabold text-white rounded-full ${showTomorrowUpNext ? 'bg-purple-600' : 'bg-[var(--accent)]'}`}>
                          {showTomorrowUpNext ? `Up Next Tomorrow (${tomorrowDayName})` : 'Up Next Today'}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 flex items-center gap-1">
                          <Clock size={13} /> {primaryPendingClass.start} &ndash; {primaryPendingClass.end}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">
                        {primaryPendingClass.title}
                      </h3>
                      <p className="text-xs font-semibold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">
                        Room: <span className="text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800">{primaryPendingClass.room || 'Default Room'}</span>
                      </p>
                    </div>
                    
                    <span className="text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 italic">
                      Click status to record ({targetMarkDate})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button 
                      className="group flex flex-col items-center justify-center p-5 bg-green-500/10 group-data-[scheme=light]:bg-green-50 text-green-500 group-data-[scheme=light]:text-green-700 rounded-2xl border border-green-500/20 group-data-[scheme=light]:border-green-200 hover:bg-green-500/20 hover:scale-[1.02] transition-all"
                      onClick={() => handleMarkClass(primaryPendingClass.title, targetMarkDate, 'Present')}
                    >
                      <CheckCircle2 size={30} className="mb-2 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-sm">Present</span>
                    </button>
                    
                    <button 
                      className="group flex flex-col items-center justify-center p-5 bg-red-500/10 group-data-[scheme=light]:bg-red-50 text-red-500 group-data-[scheme=light]:text-red-700 rounded-2xl border border-red-500/20 group-data-[scheme=light]:border-red-200 hover:bg-red-500/20 hover:scale-[1.02] transition-all"
                      onClick={() => handleMarkClass(primaryPendingClass.title, targetMarkDate, 'Absent')}
                    >
                      <XCircle size={30} className="mb-2 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-sm">Absent</span>
                    </button>
                    
                    <button 
                      className="group flex flex-col items-center justify-center p-5 bg-yellow-500/10 group-data-[scheme=light]:bg-yellow-50 text-yellow-400 group-data-[scheme=light]:text-yellow-700 rounded-2xl border border-yellow-500/20 group-data-[scheme=light]:border-yellow-200 hover:bg-yellow-500/20 hover:scale-[1.02] transition-all"
                      onClick={() => handleMarkClass(primaryPendingClass.title, targetMarkDate, 'Late')}
                    >
                      <Clock size={30} className="mb-2 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-sm">Late</span>
                    </button>
                    
                    <button 
                      className="group flex flex-col items-center justify-center p-5 bg-blue-500/10 group-data-[scheme=light]:bg-blue-50 text-blue-500 group-data-[scheme=light]:text-blue-700 rounded-2xl border border-blue-500/20 group-data-[scheme=light]:border-blue-200 hover:bg-blue-500/20 hover:scale-[1.02] transition-all"
                      onClick={() => handleMarkClass(primaryPendingClass.title, targetMarkDate, 'Excused')}
                    >
                      <FileWarning size={30} className="mb-2 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-sm">Excused</span>
                    </button>
                    
                    <button 
                      className="group flex flex-col items-center justify-center p-5 bg-gray-500/10 group-data-[scheme=light]:bg-gray-100 text-gray-400 group-data-[scheme=light]:text-gray-600 rounded-2xl border border-gray-500/20 group-data-[scheme=light]:border-gray-300 hover:bg-gray-500/20 hover:scale-[1.02] transition-all"
                      onClick={() => handleMarkClass(primaryPendingClass.title, targetMarkDate, 'Cancelled')}
                    >
                      <Ban size={30} className="mb-2 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-sm">Cancelled</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Remaining Classes List (for Today or Tomorrow) */}
              {activeClassList.length > 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider">
                    {showTomorrowUpNext ? `Remaining Tomorrow (${activeClassList.length - 1})` : `Remaining Today (${activeClassList.length - 1})`}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeClassList.slice(1).map((cls, idx) => (
                      <div key={cls.id || idx} className={`${glassPanelClass} flex flex-col justify-between gap-4`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-[var(--accent)] flex items-center gap-1 mb-1">
                              <Clock size={12} /> {cls.start} &ndash; {cls.end}
                            </span>
                            <h4 className="text-lg font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight">
                              {cls.title}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/5 group-data-[scheme=light]:bg-gray-100 rounded-md text-[var(--text-muted)]">
                            {cls.room || 'Class'}
                          </span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/5 group-data-[scheme=light]:border-gray-100">
                          {[
                            { id: 'Present', label: 'P', color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
                            { id: 'Absent', label: 'A', color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
                            { id: 'Late', label: 'L', color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
                            { id: 'Excused', label: 'E', color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
                            { id: 'Cancelled', label: 'C', color: 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20' }
                          ].map(s => (
                            <button
                              key={s.id}
                              title={`Mark ${s.id}`}
                              onClick={() => handleMarkClass(cls.title, targetMarkDate, s.id)}
                              className={`py-2 rounded-xl text-xs font-black transition-all ${s.color}`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recorded Today Classes Toggleable Section */}
              {recordedTodayClasses.length > 0 && (
                <div className="pt-4 border-t border-white/10 group-data-[scheme=light]:border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-extrabold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      Recorded Today ({recordedTodayClasses.length})
                    </span>
                    <button 
                      onClick={() => setShowRecordedToday(!showRecordedToday)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
                    >
                      {showRecordedToday ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{showRecordedToday ? 'Hide Recorded Classes' : 'Show Recorded Classes'}</span>
                    </button>
                  </div>

                  {showRecordedToday && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {recordedTodayClasses.map((cls, idx) => {
                        const status = attendance[cls.title]?.[todayStr];
                        return (
                          <div key={cls.id || idx} className="p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl flex items-center justify-between">
                            <div>
                              <div className="text-xs font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">{cls.title}</div>
                              <div className="text-[10px] font-medium text-[var(--text-muted)]">{cls.start} &ndash; {cls.end}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 text-xs font-extrabold rounded-lg bg-emerald-500/20 text-emerald-500 group-data-[scheme=light]:text-emerald-700">
                                {status}
                              </span>
                              <button 
                                onClick={() => markAttendance(cls.title, todayStr, null)}
                                className="text-[10px] font-bold text-red-400 hover:underline"
                                title="Undo / Clear attendance"
                              >
                                Undo
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: ATTENDANCE REGISTER (Subject Select & Visual Calendar) */}
      {activeTab === 'register' && (
        <div className="space-y-6">
          <div className={`${glassPanelClass} relative z-30`}>
            <div className="mb-2">
              <label className="block text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-3 uppercase tracking-wider">
                Select Subject / Class Name
              </label>
              <Dropdown
                className="w-full md:w-1/2"
                value={selectedSubject}
                onChange={setSelectedSubject}
                options={subjects}
                placeholder="-- Choose Subject / Class --"
              />
            </div>

            {!selectedSubject && (
              <div className="mt-4 p-4 bg-blue-500/10 group-data-[scheme=light]:bg-blue-50 border border-blue-500/20 group-data-[scheme=light]:border-blue-200 rounded-2xl flex items-center gap-3 text-blue-400 group-data-[scheme=light]:text-blue-700 text-xs font-semibold">
                <Info size={18} className="shrink-0" />
                <span>Showing general overall data. Select a class above to inspect subject-specific attendance and calendar records.</span>
              </div>
            )}
          </div>

          {/* Metric Stats Grid (Shows General Overall Data until Subject is selected) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={glassPanelClass}>
              <div className="text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">
                {selectedSubject ? `${selectedSubject} Attendance Rate` : 'Overall Attendance Rate'}
              </div>
              <div className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-4">{displayStats.percentage}%</div>
              <div className="w-full bg-white/10 group-data-[scheme=light]:bg-gray-200 rounded-full h-2 shadow-inner">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${displayStats.percentage}%` }}></div>
              </div>
            </div>
            
            <div className={glassPanelClass}>
              <div className="text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">Logged Classes</div>
              <div className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1">{displayStats.total} logs</div>
              <div className="text-xs font-medium text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">
                {selectedSubject ? `Total recorded for ${selectedSubject}` : 'Total recorded across all classes'}
              </div>
            </div>
            
            <div className={glassPanelClass}>
              <div className="text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">Class Schedule</div>
              <div className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-2 truncate">
                {selectedSubject ? (subjectScheduleDays.length > 0 ? subjectScheduleDays.join(', ') : 'No scheduled days') : `${subjects.length} Subjects Configured`}
              </div>
              <div className="text-xs font-medium text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">
                {selectedSubject ? 'Weekly routine schedule' : 'Select a subject to filter schedule'}
              </div>
            </div>
          </div>

          {/* Stats Counters Row */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 group-data-[scheme=light]:text-green-700 font-extrabold shadow-sm">
              Present: {displayStats.present || 0}
            </div>
            <div className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 group-data-[scheme=light]:text-red-700 font-extrabold shadow-sm">
              Absent: {displayStats.absent || 0}
            </div>
            <div className="px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 group-data-[scheme=light]:text-yellow-700 font-extrabold shadow-sm">
              Late: {displayStats.late || 0}
            </div>
            <div className="px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 group-data-[scheme=light]:text-blue-700 font-extrabold shadow-sm">
              Excused: {displayStats.excused || 0}
            </div>
            <div className="px-6 py-3 rounded-2xl bg-gray-500/10 border border-gray-500/20 text-gray-400 group-data-[scheme=light]:text-gray-600 font-extrabold shadow-sm">
              Cancelled: {displayStats.cancelled || 0}
            </div>
          </div>

          {/* Calendar Month View Grid (Prompts for subject selection if unselected) */}
          {!selectedSubject ? (
            <div className={glassPanelClass}>
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <BookOpen size={40} className="text-[var(--accent)] mb-3 animate-pulse opacity-80" />
                <h4 className="font-bold text-lg text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 mb-1">Select a Class Name to View Attendance Calendar</h4>
                <p className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 max-w-md">
                  Choose a subject from the dropdown above to view its interactive monthly attendance register and calendar grid.
                </p>
              </div>
            </div>
          ) : (
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
        </div>
      )}

      {/* Alert Modal */}
      <Modal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title="Attendance Status">
        <div className="flex flex-col items-center text-center py-4">
          <AlertCircle className="w-16 h-16 text-[var(--accent)] mb-4" />
          <p className="text-lg text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 font-medium">
            {alertMessage}
          </p>
          <button 
            onClick={() => setIsAlertOpen(false)}
            className="mt-6 px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            Got it
          </button>
        </div>
      </Modal>

      {/* Edit Attendance Modal for Calendar */}
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
