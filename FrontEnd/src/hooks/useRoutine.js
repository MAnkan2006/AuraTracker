import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const useRoutine = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const routine = appState.routine || [];

  const addClass = async (newClass) => {
    const classWithId = {
      ...newClass,
      id: newClass.id || generateId()
    };
    const updatedRoutine = [...routine, classWithId];
    updateAppState({ routine: updatedRoutine });
  };

  const getTodayClasses = () => {
    const todayDay = new Date().getDay();
    const todayDayNormalized = todayDay === 0 ? 7 : todayDay; // 1 = Mon ... 7 = Sun
    const todayStr = new Date().toISOString().split('T')[0];

    return routine.filter(c => {
      if (c.isSpecial) {
        return c.date === todayStr;
      }
      return c.day === todayDayNormalized || c.day === todayDay;
    });
  };

  const importClasses = (newClasses) => {
    const classesWithIds = (newClasses || []).map(c => ({
      ...c,
      id: c.id || generateId()
    }));
    const updatedRoutine = [...routine, ...classesWithIds];
    updateAppState({ routine: updatedRoutine });
  };

  const removeClass = (classId) => {
    const updatedRoutine = routine.filter(c => {
      if (c.id) {
        return c.id !== classId;
      }
      console.warn('[useRoutine] Falling back to title-based removal for class missing an id:', c);
      return c.title !== classId;
    });
    updateAppState({ routine: updatedRoutine });
  };

  const removeMultipleClasses = (classIds) => {
    const updatedRoutine = routine.filter(c => {
      if (c.id) {
        return !classIds.includes(c.id);
      }
      console.warn('[useRoutine] Falling back to title-based bulk removal for class missing an id:', c);
      return !classIds.includes(c.title);
    });
    updateAppState({ routine: updatedRoutine });
  };

  return { routine, addClass, getTodayClasses, importClasses, removeClass, removeMultipleClasses };
};
