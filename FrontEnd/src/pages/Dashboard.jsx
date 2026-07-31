import React from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useRoutine } from '../hooks/useRoutine';
import { useTasks } from '../hooks/useTasks';
import { Target, CheckSquare, Flame, CalendarClock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ClockWidget from '../components/ui/ClockWidget';

const mockPerformanceData = [
  { subject: 'Mathematics', attendance: 85, color: '#3b82f6' },
  { subject: 'Physics', attendance: 92, color: '#10b981' },
  { subject: 'Computer Sci', attendance: 78, color: '#f59e0b' },
  { subject: 'History', attendance: 65, color: '#ef4444' }
];

const mockHeatmapData = Array.from({ length: 35 }).map((_, i) => {
  const rand = Math.random();
  if (rand > 0.8) return 'empty';
  if (rand > 0.6) return 'p';
  if (rand > 0.4) return 'a';
  if (rand > 0.2) return 'l';
  return 'e';
});

const getHeatmapColor = (status) => {
  switch (status) {
    case 'p': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
    case 'a': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
    case 'l': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
    case 'e': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
    default: return 'bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-gray-200';
  }
};

const Dashboard = () => {
  const { getStats } = useAttendance();
  const { getTodayClasses } = useRoutine();
  const { tasks } = useTasks();

  const stats = getStats();
  const todayClasses = getTodayClasses();
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5);

  const glassPanelClass = "group bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-data-[scheme=light]:shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] group-data-[scheme=light]:hover:shadow-md cursor-pointer";

  return (
    <div className="space-y-6 pb-20">
      
      {/* Date & Greeting Row */}
      <div className="flex justify-between items-start mb-8 min-h-[100px]">
        <div className="mt-4">
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">Dashboard</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Here's what's happening today.</p>
        </div>
        <div className="hidden sm:block text-right z-10 flex-shrink-0">
          <ClockWidget />
        </div>
      </div>

      {/* Overview Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className={glassPanelClass}>
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-[0_4px_12px_rgba(59,130,246,0.3)] text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Target size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Attendance</h3>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">{stats.percentage}%</span>
            <span className="text-sm font-semibold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mb-1">Target: 75%</span>
          </div>
          <div className="w-full bg-white/10 group-data-[scheme=light]:bg-gray-200 rounded-full h-2.5 mt-5 shadow-inner">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${stats.percentage}%` }}></div>
          </div>
        </div>

        <div className={glassPanelClass}>
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-[0_4px_12px_rgba(16,185,129,0.3)] text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <CheckSquare size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Tasks</h3>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">
              {tasks.filter(t => t.completed).length} <span className="text-xl text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 font-medium">/ {tasks.length}</span>
            </span>
            <span className="text-sm font-semibold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mb-1">Completed</span>
          </div>
          <div className="w-full bg-white/10 group-data-[scheme=light]:bg-gray-200 rounded-full h-2.5 mt-5 shadow-inner">
            <div className="bg-gradient-to-r from-emerald-400 to-green-600 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${(tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className={glassPanelClass}>
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-[0_4px_12px_rgba(249,115,22,0.3)] text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Flame size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Momentum</h3>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">12<span className="text-xl text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 font-medium ml-1">Days</span></span>
            <span className="text-sm font-semibold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mb-1">Streak</span>
          </div>
          <p className="mt-5 text-sm font-medium text-orange-400 group-data-[scheme=light]:text-orange-500">You're on fire! Keep it up!</p>
        </div>

      </div>

      {/* Today's Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        <div className={`${glassPanelClass} flex flex-col h-full`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-white/10 group-data-[scheme=light]:bg-blue-50 rounded-xl text-[var(--accent)] group-data-[scheme=light]:text-blue-600">
              <CalendarClock size={22} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Up Next Today</h3>
          </div>
          <div className="space-y-3 flex-1">
            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-black/[0.04]">
                <CalendarClock size={32} className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mb-3 opacity-50" />
                <p className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 font-medium">No classes scheduled.</p>
              </div>
            ) : (
              todayClasses.map((cls, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-black/[0.08] hover:border-[var(--accent)]/50 group-data-[scheme=light]:hover:border-blue-200 transition-colors group/item">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 group-hover/item:text-[var(--accent)] transition-colors">{cls.title}</h4>
                    <p className="text-sm font-medium text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500">{cls.start} - {cls.end}</p>
                  </div>
                  <span className="px-3 py-1.5 bg-white/10 group-data-[scheme=light]:bg-blue-100/50 text-[var(--text-secondary)] group-data-[scheme=light]:text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-white/5 group-data-[scheme=light]:border-blue-200/50">
                    {cls.room || cls.type || 'Event'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${glassPanelClass} flex flex-col h-full`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-white/10 group-data-[scheme=light]:bg-red-50 rounded-xl text-red-400 group-data-[scheme=light]:text-red-500">
              <AlertCircle size={22} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Due Soon</h3>
          </div>
          <div className="space-y-3 flex-1">
            {pendingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-black/[0.04]">
                <CheckSquare size={32} className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mb-3 opacity-50" />
                <p className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 font-medium">No pending tasks.</p>
              </div>
            ) : (
              pendingTasks.map((task, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-black/[0.08] hover:border-red-400/50 group-data-[scheme=light]:hover:border-red-200 transition-colors group/item">
                  <span className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800">{task.text}</span>
                  <span className="text-xs text-red-400 group-data-[scheme=light]:text-red-600 font-bold uppercase tracking-wider bg-red-400/10 group-data-[scheme=light]:bg-red-50 px-3 py-1.5 rounded-lg border border-red-400/20 group-data-[scheme=light]:border-red-100">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Core Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Chart: Class Performance Breakdown */}
        <div className={`${glassPanelClass} flex flex-col`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Class Performance Breakdown</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10 group-data-[scheme=light]:opacity-20 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400" vertical={false} />
                <XAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--text-primary)' }} 
                />
                <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                  {mockPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Attendance Heatmap Grid */}
        <div className={`${glassPanelClass} flex flex-col`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Visual Attendance Grid</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {mockHeatmapData.map((status, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-md sm:rounded-xl transition-all duration-300 hover:scale-110 ${getHeatmapColor(status)}`}
                  title={`Status: ${status === 'empty' ? 'Inactive' : status.toUpperCase()}`}
                ></div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mt-2">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> Present</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> Absent</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span> Late</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span> Excused</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white/10 group-data-[scheme=light]:bg-gray-200 border border-white/20"></span> Inactive</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
