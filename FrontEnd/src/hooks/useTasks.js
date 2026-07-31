import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../services/api';

export const useTasks = () => {
  const { appState, updateAppState } = useContext(AppContext);
  const tasks = appState.todos || [];

  const addTask = async (task) => {
    const updatedTasks = [...tasks, { ...task, id: Date.now(), completed: false }];
    updateAppState({ todos: updatedTasks });
  };

  const toggleTask = async (taskId) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    updateAppState({ todos: updatedTasks });
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    updateAppState({ todos: updatedTasks });
  };

  return { tasks, addTask, toggleTask, deleteTask };
};
