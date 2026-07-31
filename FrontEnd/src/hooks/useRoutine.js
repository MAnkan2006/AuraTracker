import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

export const useRoutine = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const routine = appState.routine || [];

  const addClass = async (newClass) => {
    const updatedRoutine = [...routine, newClass];
    updateAppState({ routine: updatedRoutine });
  };

  const getTodayClasses = () => {
    const today = new Date().getDay();
    return routine.filter(c => c.day === today);
  };

  const importClasses = (newClasses) => {
    // Merge without creating duplicates (simple merge for now)
    const updatedRoutine = [...routine, ...newClasses];
    updateAppState({ routine: updatedRoutine });
  };

  const removeClass = (classId) => {
    const updatedRoutine = routine.filter(c => (c.id || c.title) !== classId);
    updateAppState({ routine: updatedRoutine });
  };

  const removeMultipleClasses = (classIds) => {
    const updatedRoutine = routine.filter(c => !classIds.includes(c.id || c.title));
    updateAppState({ routine: updatedRoutine });
  };

  return { routine, addClass, getTodayClasses, importClasses, removeClass, removeMultipleClasses };
};
