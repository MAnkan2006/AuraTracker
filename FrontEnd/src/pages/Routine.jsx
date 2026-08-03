import React, { useState, useRef } from 'react';
import { useRoutine } from '../hooks/useRoutine';
import { useAttendance } from '../hooks/useAttendance';
import { useToast } from '../context/ToastContext';
import { CalendarRange, Plus, UploadCloud, ListChecks, Trash2, Clock, CheckCircle2, XCircle, FileWarning, Ban, Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '../components/ui/Modal';
import TimePickerModal from '../components/ui/TimePickerModal';
import DatePickerModal from '../components/ui/DatePickerModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Dropdown from '../components/ui/Dropdown';
const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Routine = () => {
  const { routine, addClass, importClasses, removeClass, removeMultipleClasses } = useRoutine();
  const { attendance, markAttendance } = useAttendance();
  const { addToast } = useToast();
  
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '', start: '09:00', end: '10:00', room: '', day: 1, isSpecial: false, date: ''
  });
  
  const [activeTimePicker, setActiveTimePicker] = useState(null); // 'start' | 'end' | null
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      addToast("Please select a valid PDF file.", "error");
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await api.post('/routine/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newClasses = response.data.classes || response.data;
      if (newClasses && newClasses.length > 0) {
        importClasses(newClasses);
        addToast(`Successfully imported ${newClasses.length} classes!`, "success");
      } else {
        addToast("No classes could be extracted from the PDF.", "error");
      }
    } catch (error) {
      console.error("Import Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to extract timetable.";
      addToast(`Extraction failed: ${errorMsg}`, "error");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const todayDayNum = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDay, setSelectedDay] = useState(todayDayNum); // Default to today (1-7)
  const [expandedDays, setExpandedDays] = useState([todayDayNum]);

  const toggleExpandDay = (dayKey) => {
    setExpandedDays(prev => 
      prev.includes(dayKey) ? prev.filter(d => d !== dayKey) : [...prev, dayKey]
    );
  };

  const dailyOptions = [1, 2, 3, 4, 5, 6, 7, 'special'];
  const currentOptIndex = dailyOptions.indexOf(selectedDay);

  const handlePrevDay = () => {
    const nextIdx = (currentOptIndex - 1 + dailyOptions.length) % dailyOptions.length;
    setSelectedDay(dailyOptions[nextIdx]);
  };

  const handleNextDay = () => {
    const nextIdx = (currentOptIndex + 1) % dailyOptions.length;
    setSelectedDay(dailyOptions[nextIdx]);
  };

  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // null means bulk delete

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeClass(itemToDelete.id || itemToDelete.title);
      addToast(`Deleted ${itemToDelete.title}`, "success");
      setItemToDelete(null);
    } else if (selectedSlots.length > 0) {
      removeMultipleClasses(selectedSlots);
      addToast(`Deleted ${selectedSlots.length} classes`, "success");
      setSelectedSlots([]);
    }
    setIsDeleteModalOpen(false);
  };

  const handleSingleDelete = (cls) => {
    setItemToDelete(cls);
    setIsDeleteModalOpen(true);
  };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayStr = new Date().toISOString().split('T')[0];
  const glassPanelClass = "bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-data-[scheme=light]:shadow-sm transition-all duration-300";

  const getDayForSpecial = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + "T12:00:00").getDay();
    return d === 0 ? 7 : d;
  };

  const isSpecialInCurrentWeek = (dateStr) => {
    if (!dateStr) return false;
    const targetDate = new Date(dateStr + "T00:00:00");
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay();
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() - (currentDay - 1));
    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6);

    const monday = getLocalDateStr(mondayDate);
    const sunday = getLocalDateStr(sundayDate);

    return dateStr >= monday && dateStr <= sunday;
  };

  const isSpecialPast = (dateStr) => {
    if (!dateStr) return false;
    return dateStr < todayStr;
  };

  const getDateForWeekdayOfCurrentWeek = (weekdayNum) => {
    if (!weekdayNum || weekdayNum === 'special') return todayStr;
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // 1=Mon .. 7=Sun
    const diff = weekdayNum - currentDay;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    return getLocalDateStr(d);
  };

  const renderInlineAttendance = (subject, targetDate = todayStr, disabled = false) => {
    const currentStatus = attendance[subject]?.[targetDate];
    
    const statuses = [
      { id: 'P', name: 'Present', color: 'text-green-500 hover:bg-green-500/20 group-data-[scheme=light]:text-green-600', activeBg: 'bg-green-500 text-white' },
      { id: 'A', name: 'Absent', color: 'text-red-500 hover:bg-red-500/20 group-data-[scheme=light]:text-red-600', activeBg: 'bg-red-500 text-white' },
      { id: 'L', name: 'Late', color: 'text-yellow-500 hover:bg-yellow-500/20 group-data-[scheme=light]:text-yellow-600', activeBg: 'bg-yellow-500 text-white' },
      { id: 'E', name: 'Excused', color: 'text-blue-500 hover:bg-blue-500/20 group-data-[scheme=light]:text-blue-600', activeBg: 'bg-blue-50 text-white' },
      { id: 'C', name: 'Cancelled', color: 'text-gray-400 hover:bg-gray-500/20 group-data-[scheme=light]:text-gray-500', activeBg: 'bg-gray-500 text-white' }
    ];

    if (isBeforeSessionStart(targetDate)) {
      return (
        <div className="mt-3 pt-3 border-t border-[var(--accent)]/10 group-data-[scheme=light]:border-gray-200 flex justify-between items-center text-[11px] text-red-400 group-data-[scheme=light]:text-red-600 italic">
          <span>Attendance disabled prior to Session Start ({sessionStartDateStr})</span>
        </div>
      );
    }

    if (disabled) {
      return (
        <div className="mt-3 pt-3 border-t border-[var(--accent)]/10 group-data-[scheme=light]:border-gray-200 flex justify-between items-center text-[11px] text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 italic">
          <span>Attendance log available on {targetDate}</span>
        </div>
      );
    }

    return (
      <div className="mt-3 pt-3 border-t border-[var(--accent)]/10 group-data-[scheme=light]:border-gray-200 flex justify-between gap-1">
        {statuses.map(s => {
          const isActive = currentStatus === s.name;
          return (
            <button
              key={s.id}
              title={isActive ? `Clear ${s.name}` : `Mark ${s.name}`}
              onClick={() => markAttendance(subject, targetDate, isActive ? null : s.name)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold transition-all ${isActive ? s.activeBg + ' shadow-md scale-110' : s.color + ' bg-white/5 group-data-[scheme=light]:bg-gray-100'}`}
            >
              {s.id}
            </button>
          );
        })}
      </div>
    );
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    
    if (!newClass.title || !newClass.start || !newClass.end) {
      addToast("Please enter a Title, Start Time, and End Time.", "error");
      return;
    }
    
    if (newClass.day === 'special' && !newClass.date) {
      addToast("Please select a date for your special class.", "error");
      return;
    }

    const uniqueId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    if (newClass.day === 'special') {
      addClass({ ...newClass, id: uniqueId, isSpecial: true, day: null });
    } else {
      addClass({ ...newClass, id: uniqueId, isSpecial: false, day: parseInt(newClass.day) });
    }
    
    setIsAddClassOpen(false);
    addToast("Class added successfully!", "success");
    setNewClass({ title: '', start: '09:00', end: '10:00', room: '', day: 1, isSpecial: false, date: '' });
  };

  const inputClass = "w-full p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all placeholder-[var(--text-muted)] group-data-[scheme=light]:placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2";

  const getWeeklySlotClasses = (weekdayNum) => {
    return routine.filter(c => {
      if (c.isSpecial) {
        return getDayForSpecial(c.date) === weekdayNum && isSpecialInCurrentWeek(c.date);
      }
      return c.day === weekdayNum;
    });
  };

  const getDailyTabClasses = (selectedTab) => {
    if (selectedTab === 'special') {
      return routine.filter(c => c.isSpecial);
    }
    return routine.filter(c => {
      if (c.isSpecial) {
        return getDayForSpecial(c.date) === selectedTab && isSpecialInCurrentWeek(c.date);
      }
      return c.day === selectedTab;
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">Weekly Routine</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Manage your schedule and daily habits.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white/5 group-data-[scheme=light]:bg-gray-100 rounded-xl p-1 border border-white/10 group-data-[scheme=light]:border-gray-200">
            <button 
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'daily' ? 'bg-[var(--card-bg)] group-data-[scheme=light]:bg-white text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 shadow-sm' : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-700'}`}
              onClick={() => setViewMode('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'weekly' ? 'bg-[var(--card-bg)] group-data-[scheme=light]:bg-white text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 shadow-sm' : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-700'}`}
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </button>
          </div>

          <input 
            type="file" 
            accept="application/pdf" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 rounded-xl hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 transition-colors font-bold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            <span className="hidden sm:inline">{isImporting ? "Importing..." : "Import PDF"}</span>
          </button>
          
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors font-bold text-sm shadow-sm ${isManageMode ? 'bg-red-500/10 border-red-500/20 text-red-500 group-data-[scheme=light]:text-red-600 hover:bg-red-500/20' : 'bg-white/5 group-data-[scheme=light]:bg-white border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50'}`}
            onClick={() => {
              setIsManageMode(!isManageMode);
              if (isManageMode) setSelectedSlots([]);
            }}
          >
            <ListChecks size={18} />
            <span className="hidden sm:inline">{isManageMode ? 'Cancel Manage' : 'Manage'}</span>
          </button>

          <button 
            onClick={() => setIsAddClassOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_4px_15px_var(--accent-glow)] font-bold text-sm border border-[var(--card-border)] group"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {isManageMode && (
        <div className="flex items-center justify-between p-4 bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl mb-6 shadow-sm">
          <span className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800">
            {selectedSlots.length} selected
          </span>
          <div className="flex items-center gap-3">
            <button className="text-sm font-bold text-[var(--accent)] hover:underline" onClick={() => setSelectedSlots(routine.map(r => r.id || r.title))}>
              Select All
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${selectedSlots.length > 0 ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' : 'bg-red-500/50 text-white/50 cursor-not-allowed'}`}
              disabled={selectedSlots.length === 0}
              onClick={() => {
                setItemToDelete(null);
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2 size={16} />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      <div className={glassPanelClass}>
        {viewMode === 'weekly' ? (
          <>
            {/* Desktop Weekly View: 7 Columns Grid */}
            <div className="hidden md:grid md:grid-cols-7 gap-4">
              {days.map((day, index) => {
                const dayClasses = getWeeklySlotClasses(index + 1);
                return (
                  <div 
                    key={day} 
                    className="animate-fade-in-up bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl overflow-hidden shadow-inner flex flex-col h-[500px]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="bg-white/10 group-data-[scheme=light]:bg-gray-200/50 p-3 text-center border-b border-white/5 group-data-[scheme=light]:border-gray-200 font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 text-sm tracking-wide flex items-center justify-center gap-1.5">
                      <span>{day}</span>
                      {index + 1 === todayDayNum && (
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" title="Today"></span>
                      )}
                    </div>
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 group-data-[scheme=light]:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {dayClasses.length === 0 ? (
                        <div className="text-center text-sm text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mt-8 italic font-medium">Free day</div>
                      ) : (
                        dayClasses.map((cls, idx) => {
                          const classKey = cls.id || cls.title;
                          const isPast = cls.isSpecial && isSpecialPast(cls.date);
                          return (
                            <div key={cls.id || idx} className={`relative group p-4 border rounded-xl hover:bg-white/5 transition-colors shadow-[0_2px_10px_var(--accent-glow)] group-data-[scheme=light]:shadow-sm ${cls.isSpecial ? 'bg-purple-500/10 border-purple-500/20' : 'bg-[var(--accent)]/10 border-[var(--accent)]/20 group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:border-blue-100 group-data-[scheme=light]:hover:bg-blue-100'} ${isPast ? 'opacity-65' : ''}`}>
                              {isManageMode && (
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                  <button 
                                    onClick={() => handleSingleDelete(cls)}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                                    checked={selectedSlots.includes(classKey)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedSlots([...selectedSlots, classKey]);
                                      else setSelectedSlots(selectedSlots.filter(id => id !== classKey));
                                    }}
                                  />
                                </div>
                              )}
                              <div className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight mb-1 pr-6 flex items-center justify-between">
                                <span>{cls.title}</span>
                                {isPast && <span className="text-[10px] font-bold text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded-md">Past</span>}
                              </div>
                              <div className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 text-[11px] font-semibold mb-2">{cls.start} - {cls.end}</div>
                              <span className="inline-block px-2 py-1 bg-[var(--bg-base)] group-data-[scheme=light]:bg-white text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200">{cls.room || 'Event'}</span>
                              
                              {!isManageMode && renderInlineAttendance(cls.title, cls.isSpecial ? cls.date : getDateForWeekdayOfCurrentWeek(index + 1))}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Weekly View: Collapsible Accordion */}
            <div className="md:hidden space-y-3">
              {days.map((day, index) => {
                const weekdayNum = index + 1;
                const isToday = weekdayNum === todayDayNum;
                const isExpanded = expandedDays.includes(weekdayNum);
                const dayClasses = getWeeklySlotClasses(weekdayNum);

                return (
                  <div 
                    key={day} 
                    className="bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleExpandDay(weekdayNum)}
                      className="w-full flex items-center justify-between p-4 bg-white/10 group-data-[scheme=light]:bg-gray-100 text-left font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{day}</span>
                        {isToday && (
                          <span className="px-2 py-0.5 text-[10px] bg-[var(--accent)] text-white font-extrabold rounded-full tracking-wider uppercase">
                            Today
                          </span>
                        )}
                        <span className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 font-medium">
                          • {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={20} className="text-[var(--accent)]" /> : <ChevronDown size={20} className="text-[var(--text-muted)]" />}
                    </button>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1500px] opacity-100 p-3 space-y-3 border-t border-white/5 group-data-[scheme=light]:border-gray-200' : 'max-h-0 opacity-0 p-0'}`}>
                      {dayClasses.length === 0 ? (
                        <div className="text-center text-sm text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 py-4 italic font-medium">Free day &mdash; No classes scheduled</div>
                      ) : (
                        dayClasses.map((cls, idx) => {
                          const classKey = cls.id || cls.title;
                          const isPast = cls.isSpecial && isSpecialPast(cls.date);
                          return (
                            <div key={cls.id || idx} className={`relative group p-4 border rounded-xl hover:bg-white/5 transition-colors shadow-sm ${cls.isSpecial ? 'bg-purple-500/10 border-purple-500/20' : 'bg-[var(--accent)]/10 border-[var(--accent)]/20 group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:border-blue-100'} ${isPast ? 'opacity-65' : ''}`}>
                              {isManageMode && (
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                  <button 
                                    onClick={() => handleSingleDelete(cls)}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                                    checked={selectedSlots.includes(classKey)}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedSlots([...selectedSlots, classKey]);
                                      else setSelectedSlots(selectedSlots.filter(id => id !== classKey));
                                    }}
                                  />
                                </div>
                              )}
                              <div className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight mb-1 pr-6 flex items-center justify-between">
                                <span>{cls.title}</span>
                                {isPast && <span className="text-[10px] font-bold text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded-md">Past</span>}
                              </div>
                              <div className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 text-[11px] font-semibold mb-2">{cls.start} - {cls.end}</div>
                              <span className="inline-block px-2 py-1 bg-[var(--bg-base)] group-data-[scheme=light]:bg-white text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200">{cls.room || 'Event'}</span>
                              
                              {!isManageMode && renderInlineAttendance(cls.title, cls.isSpecial ? cls.date : getDateForWeekdayOfCurrentWeek(weekdayNum))}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Special Classes accordion item if present */}
              {routine.some(c => c.isSpecial) && (
                <div className="bg-purple-500/10 group-data-[scheme=light]:bg-purple-50 border border-purple-500/20 group-data-[scheme=light]:border-purple-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                  <button
                    onClick={() => toggleExpandDay('special')}
                    className="w-full flex items-center justify-between p-4 bg-purple-500/20 group-data-[scheme=light]:bg-purple-100 text-left font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-purple-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarRange size={18} className="text-purple-400" />
                      <span className="text-base font-bold text-purple-400 group-data-[scheme=light]:text-purple-800">Special Classes</span>
                      <span className="text-xs text-purple-400/80 group-data-[scheme=light]:text-purple-700 font-medium">
                        • {routine.filter(c => c.isSpecial).length} events
                      </span>
                    </div>
                    {expandedDays.includes('special') ? <ChevronUp size={20} className="text-purple-400" /> : <ChevronDown size={20} className="text-purple-400" />}
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedDays.includes('special') ? 'max-h-[1500px] opacity-100 p-3 space-y-3 border-t border-purple-500/20' : 'max-h-0 opacity-0 p-0'}`}>
                    {routine.filter(c => c.isSpecial).map((cls, idx) => {
                      const classKey = cls.id || cls.title;
                      const isPast = isSpecialPast(cls.date);
                      return (
                        <div key={cls.id || idx} className={`relative group p-4 bg-purple-500/10 group-data-[scheme=light]:bg-purple-100/50 border border-purple-500/20 rounded-xl shadow-sm ${isPast ? 'opacity-65' : ''}`}>
                          {isManageMode && (
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <button 
                                onClick={() => handleSingleDelete(cls)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500 cursor-pointer"
                                checked={selectedSlots.includes(classKey)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedSlots([...selectedSlots, classKey]);
                                  else setSelectedSlots(selectedSlots.filter(id => id !== classKey));
                                }}
                              />
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight pr-6">{cls.title}</div>
                            {isPast && <span className="text-[10px] font-bold text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded-md">Past</span>}
                          </div>
                          <div className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 text-[11px] font-semibold mb-2">{cls.start} - {cls.end}</div>
                          <div className="flex justify-between items-center">
                            <span className="inline-block px-2 py-1 bg-[var(--bg-base)] group-data-[scheme=light]:bg-white text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200">{cls.room || 'Event'}</span>
                            <span className="text-[10px] font-bold text-purple-400 group-data-[scheme=light]:text-purple-600 bg-purple-500/10 px-2 py-1 rounded-md">{cls.date}</span>
                          </div>
                          
                          {!isManageMode && renderInlineAttendance(cls.title, cls.date, cls.date !== todayStr)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          
            {routine.some(c => c.isSpecial) && (
              <div className="hidden md:block mt-8 pt-8 border-t border-[var(--card-border)] group-data-[scheme=light]:border-gray-200">
                <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-4 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-500"><CalendarRange size={18} /></span>
                  Special Classes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {routine.filter(c => c.isSpecial).map((cls, idx) => {
                    const classKey = cls.id || cls.title;
                    const isPast = isSpecialPast(cls.date);
                    return (
                      <div key={cls.id || idx} className={`relative group p-4 bg-purple-500/10 group-data-[scheme=light]:bg-purple-50 border border-purple-500/20 group-data-[scheme=light]:border-purple-200 rounded-xl shadow-[0_2px_10px_rgba(168,85,247,0.15)] group-data-[scheme=light]:shadow-sm ${isPast ? 'opacity-65' : ''}`}>
                        {isManageMode && (
                          <div className="absolute top-2 right-2 flex items-center gap-2">
                            <button 
                              onClick={() => handleSingleDelete(cls)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500 cursor-pointer"
                              checked={selectedSlots.includes(classKey)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedSlots([...selectedSlots, classKey]);
                                else setSelectedSlots(selectedSlots.filter(id => id !== classKey));
                              }}
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight pr-6">{cls.title}</div>
                          {isPast && <span className="text-[10px] font-bold text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded-md">Past</span>}
                        </div>
                        <div className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 text-[11px] font-semibold mb-2">{cls.start} - {cls.end}</div>
                        <div className="flex justify-between items-center">
                          <span className="inline-block px-2 py-1 bg-[var(--bg-base)] group-data-[scheme=light]:bg-white text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200">{cls.room || 'Event'}</span>
                          <span className="text-[10px] font-bold text-purple-400 group-data-[scheme=light]:text-purple-600 bg-purple-500/10 px-2 py-1 rounded-md">{cls.date}</span>
                        </div>
                        
                        {!isManageMode && renderInlineAttendance(cls.title, cls.date, cls.date !== todayStr)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col">
            {/* Desktop Tabs */}
            <div className="hidden md:flex justify-start overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
              {days.map((day, idx) => (
                <button 
                  key={day}
                  onClick={() => setSelectedDay(idx + 1)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedDay === idx + 1 ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-white/5 group-data-[scheme=light]:bg-gray-100 text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200'}`}
                >
                  {day}
                </button>
              ))}
              <button 
                onClick={() => setSelectedDay('special')}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedDay === 'special' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-purple-500/10 group-data-[scheme=light]:bg-purple-50 text-purple-400 group-data-[scheme=light]:text-purple-600 hover:bg-purple-500/20 border border-purple-500/20'}`}
              >
                Special Classes
              </button>
            </div>

            {/* Mobile Arrow Switcher */}
            <div className="md:hidden flex items-center justify-between bg-white/5 group-data-[scheme=light]:bg-gray-100 p-3 rounded-2xl border border-white/10 group-data-[scheme=light]:border-gray-200 mb-6 shadow-sm">
              <button 
                onClick={handlePrevDay}
                className="p-2.5 rounded-xl bg-white/10 group-data-[scheme=light]:bg-white hover:bg-white/20 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 transition-all active:scale-95 shadow-sm"
                aria-label="Previous Day"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="text-center">
                <div className="text-lg font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 flex items-center gap-2 justify-center">
                  <span>{selectedDay === 'special' ? 'Special Classes' : days[selectedDay - 1]}</span>
                  {selectedDay === todayDayNum && (
                    <span className="px-2 py-0.5 text-[10px] bg-[var(--accent)] text-white font-black rounded-full uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-0.5">
                  {getDailyTabClasses(selectedDay).length} {getDailyTabClasses(selectedDay).length === 1 ? 'class' : 'classes'} scheduled
                </div>
              </div>

              <button 
                onClick={handleNextDay}
                className="p-2.5 rounded-xl bg-white/10 group-data-[scheme=light]:bg-white hover:bg-white/20 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 transition-all active:scale-95 shadow-sm"
                aria-label="Next Day"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getDailyTabClasses(selectedDay).length === 0 ? (
                <div className="col-span-full text-center text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mt-8 italic font-medium p-8 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-gray-200">
                  No classes scheduled.
                </div>
              ) : (
                getDailyTabClasses(selectedDay).map((cls, idx) => {
                  const classKey = cls.id || cls.title;
                  const isPast = cls.isSpecial && isSpecialPast(cls.date);
                  return (
                    <div key={cls.id || idx} className={`relative group p-6 border rounded-2xl transition-colors shadow-[0_2px_10px_var(--accent-glow)] group-data-[scheme=light]:shadow-sm ${cls.isSpecial ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20' : 'bg-[var(--accent)]/10 border-[var(--accent)]/20 group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:border-blue-100 hover:bg-[var(--accent)]/20 group-data-[scheme=light]:hover:bg-blue-100'} ${isPast ? 'opacity-65' : ''}`}>
                      {isManageMode && (
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button 
                            onClick={() => handleSingleDelete(cls)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                            checked={selectedSlots.includes(classKey)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedSlots([...selectedSlots, classKey]);
                              else setSelectedSlots(selectedSlots.filter(id => id !== classKey));
                            }}
                          />
                        </div>
                      )}
                      <div className="font-extrabold text-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight mb-2 pr-6 flex items-center justify-between">
                        <span>{cls.title}</span>
                        {isPast && <span className="text-xs font-bold text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded-md">Past</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 text-sm font-semibold mb-4">
                        <Clock size={14} className="text-[var(--accent)]" />
                        {cls.start} - {cls.end}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-3 py-1.5 bg-[var(--bg-base)] group-data-[scheme=light]:bg-white text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 text-xs uppercase font-bold tracking-wider rounded-lg border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200">{cls.room || 'Event'}</span>
                        {cls.isSpecial && <span className="text-xs font-bold text-purple-400 group-data-[scheme=light]:text-purple-600 bg-purple-500/10 px-3 py-1.5 rounded-lg">{cls.date}</span>}
                      </div>
                      
                      {!isManageMode && renderInlineAttendance(cls.title, cls.isSpecial ? cls.date : getDateForWeekdayOfCurrentWeek(selectedDay))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} title="Add New Class">
        <form onSubmit={handleAddClass} className="space-y-5">
          <div>
            <label className={labelClass}>Class Title</label>
            <input 
              type="text" 
              required
              className={inputClass}
              placeholder="e.g. Advanced Physics"
              value={newClass.title}
              onChange={(e) => setNewClass({...newClass, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Time</label>
              <button
                type="button"
                className={`${inputClass} flex items-center justify-between text-left`}
                onClick={() => setActiveTimePicker('start')}
              >
                <span>{newClass.start || 'Select Start'}</span>
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
                <span>{newClass.end || 'Select End'}</span>
                <Clock size={18} className="text-[var(--accent)] opacity-70" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Day of Week</label>
              <Dropdown
                value={newClass.day}
                onChange={(val) => setNewClass({...newClass, day: val})}
                options={[
                  ...days.map((day, index) => ({ value: index + 1, label: day })),
                  { value: 'special', label: 'Special Date', className: 'text-[var(--accent)] font-bold' }
                ]}
              />
            </div>
            <div>
              <label className={labelClass}>Room / Location</label>
              <input 
                type="text" 
                className={inputClass}
                placeholder="e.g. Room 101"
                value={newClass.room}
                onChange={(e) => setNewClass({...newClass, room: e.target.value})}
              />
            </div>
          </div>
          
          {newClass.day === 'special' && (
            <div>
              <label className={labelClass}>Special Class Date</label>
              <button
                type="button"
                className={`${inputClass} flex items-center justify-between text-left`}
                onClick={() => setIsDatePickerOpen(true)}
              >
                <span>{newClass.date || 'Select Date'}</span>
                <CalendarRange size={18} className="text-[var(--accent)] opacity-70" />
              </button>
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full mt-2 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white font-bold rounded-2xl hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_var(--accent-glow)]"
          >
            Save Class
          </button>
        </form>
      </Modal>

      <TimePickerModal 
        isOpen={activeTimePicker !== null}
        onClose={() => setActiveTimePicker(null)}
        initialTime={activeTimePicker === 'start' ? (newClass.start || '09:00') : (newClass.end || '10:00')}
        title={activeTimePicker === 'start' ? "Select Start Time" : "Select End Time"}
        onConfirm={(timeStr) => {
          if (activeTimePicker === 'start') setNewClass({...newClass, start: timeStr});
          if (activeTimePicker === 'end') setNewClass({...newClass, end: timeStr});
          setActiveTimePicker(null);
        }}
      />

      <DatePickerModal 
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        initialDate={newClass.date}
        onConfirm={(dateStr) => {
          setNewClass({...newClass, date: dateStr});
          setIsDatePickerOpen(false);
        }}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Class"
        message={itemToDelete ? `Are you sure you want to delete ${itemToDelete.title}?` : `Are you sure you want to delete ${selectedSlots.length} selected classes?`}
        type="danger"
        confirmText="Delete"
      />
    </div>
  );
};

export default Routine;
