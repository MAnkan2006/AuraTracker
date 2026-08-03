import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { CheckSquare, Plus, Circle, CheckCircle2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';

const Tasks = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTaskText, setNewTaskText] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  
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

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const completionPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">Task Board</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Manage and prioritize your to-dos.</p>
        </div>
      </div>

      {/* Summary Stats */}
      {tasks.length > 0 && (
        <div className={glassPanelClass}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">{tasks.length}</span>
                <span className="text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider">Total</span>
              </div>
              <div className="w-px h-10 bg-white/10 group-data-[scheme=light]:bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-green-400 group-data-[scheme=light]:text-green-600">{completedTasks.length}</span>
                <span className="text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider">Done</span>
              </div>
              <div className="w-px h-10 bg-white/10 group-data-[scheme=light]:bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[var(--accent)] group-data-[scheme=light]:text-[var(--accent-hover)]">{pendingTasks.length}</span>
                <span className="text-xs font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider">Pending</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">{completionPercent}% Complete</span>
          </div>
          <div className="w-full bg-white/10 group-data-[scheme=light]:bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-green-400 shadow-[0_0_10px_var(--accent-glow)] transition-all duration-700"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>
      )}

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
            <Plus size={20} />
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
            <>
              {/* Pending Tasks */}
              {pendingTasks.length === 0 && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 group-data-[scheme=light]:bg-green-50 group-data-[scheme=light]:border-green-200 rounded-2xl">
                  <CheckCircle2 size={20} className="text-green-400 group-data-[scheme=light]:text-green-600 shrink-0" />
                  <span className="font-bold text-green-400 group-data-[scheme=light]:text-green-700">All tasks completed! Great work! 🎉</span>
                </div>
              )}
              {pendingTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="animate-fade-in-up group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-white/5 group-data-[scheme=light]:bg-white border-white/10 group-data-[scheme=light]:border-gray-200 hover:border-[var(--accent)]/50 group-data-[scheme=light]:hover:border-[var(--accent)] hover:shadow-[0_4px_20px_var(--accent-glow)]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="transition-all duration-300 transform group-hover:scale-110 active:scale-90 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 group-hover:text-[var(--accent)]">
                    <Circle size={24} />
                  </div>
                  <span className="flex-1 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-bold">
                    {task.text}
                  </span>
                  {/* Always visible on touch, hover-reveal on desktop */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:block opacity-0 group-hover:opacity-100 text-xs font-bold text-[var(--accent)] tracking-wider uppercase transition-opacity duration-300">
                      Complete
                    </span>
                    <button 
                      onClick={(e) => confirmDelete(task, e)}
                      className="p-2 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 hover:text-red-500 hover:bg-red-500/10 group-data-[scheme=light]:hover:bg-red-50 rounded-xl transition-all duration-300
                        sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Completed Tasks — collapsible */}
              {completedTasks.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCompleted(v => !v)}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 hover:text-[var(--text-secondary)] transition-colors mb-3 px-2"
                  >
                    {showCompleted ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Completed ({completedTasks.length})
                  </button>
                  {showCompleted && (
                    <div className="space-y-3">
                      {completedTasks.map((task, index) => (
                        <div 
                          key={task.id} 
                          className="animate-fade-in-up group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer bg-white/5 border-white/5 group-data-[scheme=light]:bg-gray-50 group-data-[scheme=light]:border-transparent opacity-60 hover:opacity-80"
                          style={{ animationDelay: `${index * 0.03}s` }}
                          onClick={() => toggleTask(task.id)}
                        >
                          <div className="text-green-500 animate-pop">
                            <CheckCircle2 size={24} />
                          </div>
                          <span className="flex-1 line-through text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400">
                            {task.text}
                          </span>
                          <button 
                            onClick={(e) => confirmDelete(task, e)}
                            className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300
                              sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
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
