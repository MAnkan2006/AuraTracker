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
        if (status === 'Present') present++;
        else if (status === 'Absent') absent++;
        else if (status === 'Late') late++;
        else if (status === 'Excused') excused++;
        else if (status === 'Cancelled') cancelled++;
      });
    });

    const total = present + absent + late; 
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { present, absent, late, excused, cancelled, total, percentage };
  };

  return { attendance, markAttendance, getStats };
};
