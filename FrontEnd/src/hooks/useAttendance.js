import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

export const useAttendance = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const attendance = appState.attendance || {};

  const markAttendance = async (subject, dateKey, status) => {
    // Logic to mark attendance
    // e.g. update local state, then push to backend
    const updatedAttendance = { ...attendance };
    if (!updatedAttendance[subject]) updatedAttendance[subject] = {};
    updatedAttendance[subject][dateKey] = status;
    
    updateAppState({ attendance: updatedAttendance });
  };

  const getStats = () => {
    let present = 0, absent = 0, late = 0, excused = 0, cancelled = 0;
    
    Object.values(attendance).forEach(subjectRecords => {
      Object.values(subjectRecords).forEach(status => {
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
    const subjects = Object.keys(attendance);
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
      if (total > 0) {
        const percentage = Math.round(((present + late) / total) * 100);
        breakdown.push({
          subject,
          attendance: percentage,
          color: COLOR_PALETTE[idx % COLOR_PALETTE.length]
        });
      }
    });

    return breakdown;
  };

  const getRecentHistory = (days = 35) => {
    const history = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

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
      const dateStr = d.toISOString().split('T')[0];

      const statuses = [];
      Object.values(attendance).forEach(subjectRecords => {
        Object.entries(subjectRecords || {}).forEach(([key, status]) => {
          if (key === dateStr || key.startsWith(`${dateStr}_`)) {
            statuses.push(status);
          }
        });
      });

      if (statuses.length === 0) {
        if (i === 0) continue;
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

  return { attendance, markAttendance, getStats, getSubjectBreakdown, getRecentHistory, getStreak };
};
