import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { CheckSquare, Plus, Circle, CheckCircle2, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';

const Tasks = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTaskText, setNewTaskText] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask({ text: newTaskText });
      setNewTaskText('');
    }
  };

  const confirmDelete = (task, e) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const glassPanelClass = "bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-data-[scheme=light]:shadow-sm transition-all duration-300";

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">Task Board</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Manage and prioritize your to-dos.</p>
        </div>
      </div>

      <div className={glassPanelClass}>
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input 
            type="text"
            className="flex-1 p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none transition-all placeholder-[var(--text-muted)] group-data-[scheme=light]:placeholder-gray-400"
            placeholder="What needs to be done?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <button type="submit" className="px-6 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white rounded-2xl hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_4px_15px_var(--accent-glow)] flex items-center justify-center gap-2 font-bold whitespace-nowrap">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-white/10 group-data-[scheme=light]:border-gray-200 rounded-3xl text-center">
              <CheckSquare size={48} className="text-[var(--text-muted)] opacity-50 mb-4" />
              <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 font-medium">No tasks right now. You're all caught up!</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`animate-fade-in-up group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                  task.completed 
                    ? 'bg-white/5 border-white/5 group-data-[scheme=light]:bg-gray-50 group-data-[scheme=light]:border-transparent opacity-60' 
                    : 'bg-white/5 group-data-[scheme=light]:bg-white border-white/10 group-data-[scheme=light]:border-gray-200 hover:border-[var(--accent)]/50 group-data-[scheme=light]:hover:border-[var(--accent)] hover:shadow-[0_4px_20px_var(--accent-glow)]'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => toggleTask(task.id)}
              >
                <div className={`transition-all duration-300 transform group-hover:scale-110 active:scale-90 ${task.completed ? 'text-green-500 animate-pop' : 'text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 group-hover:text-[var(--accent)]'}`}>
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <span className={`flex-1 transition-colors duration-300 ${task.completed ? 'line-through text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400' : 'text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-bold'}`}>
                  {task.text}
                </span>
                <div className="flex items-center gap-3">
                  {!task.completed && (
                    <span className="opacity-0 group-hover:opacity-100 text-xs font-bold text-[var(--accent)] tracking-wider uppercase transition-opacity duration-300">
                      Complete
                    </span>
                  )}
                  <button 
                    onClick={(e) => confirmDelete(task, e)}
                    className="p-2 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 hover:text-red-500 hover:bg-red-500/10 group-data-[scheme=light]:hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the task "${taskToDelete?.text}"?`}
        confirmText="Delete Task"
        type="danger"
      />
    </div>
  );
};

export default Tasks;
