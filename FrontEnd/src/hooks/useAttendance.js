import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { UserContext } from '../context/UserContext';
import api from '../services/api';

const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useAttendance = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const attendance = appState.attendance || {};
  const routine = appState.routine || [];

  const rawStartDate = user?.academicProfile?.termStartDate;
  let sessionStartDateStr = null;
  if (rawStartDate) {
    const d = new Date(rawStartDate);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      sessionStartDateStr = `${year}-${month}-${day}`;
    } else if (typeof rawStartDate === 'string') {
      sessionStartDateStr = rawStartDate.split('T')[0];
    }
  }

  const isBeforeSessionStart = (dateStr) => {
    if (!sessionStartDateStr || !dateStr) return false;
    return dateStr < sessionStartDateStr;
  };

  const markAttendance = async (subject, dateKey, status) => {
    if (isBeforeSessionStart(dateKey)) {
      console.warn(`Cannot mark attendance prior to session start date (${sessionStartDateStr})`);
      return { success: false, message: `Cannot mark attendance prior to Session Start Date (${sessionStartDateStr})` };
    }

    const updatedAttendance = { ...attendance };
    if (!updatedAttendance[subject]) updatedAttendance[subject] = {};
    if (status === null || status === undefined) {
      delete updatedAttendance[subject][dateKey];
    } else {
      updatedAttendance[subject][dateKey] = status;
    }
    
    updateAppState({ attendance: updatedAttendance });
    return { success: true };
  };

  const getStats = () => {
    let present = 0, absent = 0, late = 0, excused = 0, cancelled = 0;
    
    Object.values(attendance).forEach(subjectRecords => {
      Object.values(subjectRecords || {}).forEach(status => {
        if (status === 'Present' || status === 'p') present++;
        else if (status === 'Absent' || status === 'a') absent++;
        else if (status === 'Late' || status === 'l') late++;
        else if (status === 'Excused' || status === 'e') excused++;
        else if (status === 'Cancelled' || status === 'c') cancelled++;
      });
    });

    const total = present + absent + late; 
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { present, absent, late, excused, cancelled, total, percentage };
  };

  const COLOR_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const getSubjectBreakdown = () => {
    const routineSubjects = routine.map(c => c.title).filter(Boolean);
    const attendanceSubjects = Object.keys(attendance);
    const subjects = Array.from(new Set([...routineSubjects, ...attendanceSubjects]));
    const breakdown = [];

    subjects.forEach((subject, idx) => {
      const records = attendance[subject] || {};
      let present = 0, absent = 0, late = 0;
      Object.values(records).forEach(status => {
        if (status === 'Present' || status === 'p') present++;
        else if (status === 'Absent' || status === 'a') absent++;
        else if (status === 'Late' || status === 'l') late++;
      });
      const total = present + absent + late;
      const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
      breakdown.push({
        subject,
        attendance: percentage,
        total,
        present,
        absent,
        late,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
      });
    });

    return breakdown;
  };

  const getRecentHistory = (days = 35) => {
    const history = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateStr(d);

      let dayStatus = 'empty';
      const statuses = [];

      Object.values(attendance).forEach(subjectRecords => {
        Object.entries(subjectRecords || {}).forEach(([key, status]) => {
          if (key === dateStr || key.startsWith(`${dateStr}_`)) {
            statuses.push(status);
          }
        });
      });

      if (statuses.length > 0) {
        if (statuses.some(s => s === 'Present' || s === 'p')) dayStatus = 'p';
        else if (statuses.some(s => s === 'Absent' || s === 'a')) dayStatus = 'a';
        else if (statuses.some(s => s === 'Late' || s === 'l')) dayStatus = 'l';
        else if (statuses.some(s => s === 'Excused' || s === 'e')) dayStatus = 'e';
        else dayStatus = 'empty';
      }

      history.push(dayStatus);
    }

    return history;
  };

  const getStreak = () => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateStr(d);

      const statuses = [];
      Object.values(attendance).forEach(subjectRecords => {
        Object.entries(subjectRecords || {}).forEach(([key, status]) => {
          if (key === dateStr || key.startsWith(`${dateStr}_`)) {
            if (status) statuses.push(status);
          }
        });
      });

      if (statuses.length === 0) {
        if (i === 0) continue;
        const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
        const isScheduled = routine.some(c => c.isSpecial ? c.date === dateStr : c.day === dayOfWeek);
        if (!isScheduled) {
          continue;
        }
        break;
      }

      const isPresent = statuses.some(s => s === 'Present' || s === 'p' || s === 'Late' || s === 'l');
      const isAbsent = statuses.some(s => s === 'Absent' || s === 'a');

      if (isPresent && !isAbsent) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return { 
    attendance, 
    markAttendance, 
    getStats, 
    getSubjectBreakdown, 
    getRecentHistory, 
    getStreak,
    sessionStartDateStr,
    isBeforeSessionStart
  };
};
