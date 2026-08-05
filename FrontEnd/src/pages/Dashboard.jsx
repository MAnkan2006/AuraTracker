import React, { useContext } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useRoutine } from '../hooks/useRoutine';
import { useTasks } from '../hooks/useTasks';
import { UserContext } from '../context/UserContext';
import { Target, CheckSquare, Flame, CalendarClock, AlertCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ClockWidget from '../components/ui/ClockWidget';

const getHeatmapColor = (status) => {
  switch (status) {
    case 'all_attended': 
    case 'p': 
      return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
    case 'partially_attended': 
    case 'l': 
      return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    case 'none_attended': 
    case 'a': 
      return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
    case 'e': 
      return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
    default: 
      return 'bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-gray-200';
  }
};

const getHeatmapLabel = (status) => {
  switch (status) {
    case 'all_attended': return 'All Classes Attended';
    case 'partially_attended': return 'Partially Attended';
    case 'none_attended': return 'None Attended (All Missed)';
    case 'p': return 'Present';
    case 'a': return 'Absent';
    case 'l': return 'Late';
    case 'e': return 'Excused';
    default: return 'No Attendance Logs';
  }
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[var(--popover-bg)] group-data-[scheme=light]:bg-white border border-[var(--card-border)] group-data-[scheme=light]:border-gray-200 p-3.5 rounded-2xl shadow-xl backdrop-blur-xl">
        <p className="text-sm font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1.5 font-[var(--font-heading)]">
          {data.subject}
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
          <span>
            Attendance : <strong className="text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-bold">{data.attendance}%</strong> ({data.present || 0} Present / {data.total || 0} Logs)
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { getStats, getSubjectBreakdown, getRecentHistory, getStreak, attendance } = useAttendance();
  const { routine } = useRoutine();
  const { tasks } = useTasks();
  const { user } = useContext(UserContext);

  const stats = getStats();
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5);
  const targetGoal = user?.targetGoal ?? 75;
  const performanceData = getSubjectBreakdown();
  const heatmapData = getRecentHistory(35);
  const streak = getStreak();

  // --- Date & Up Next Class Calculations ---
  const currentDate = new Date();
  const nowHour = currentDate.getHours();
  const nowMin = currentDate.getMinutes();
  const nowHHMM = `${String(nowHour).padStart(2, '0')}:${String(nowMin).padStart(2, '0')}`;

  const todayDayNum = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
  const yearStr = currentDate.getFullYear();
  const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${yearStr}-${monthStr}-${dayStr}`;

  // Tomorrow Date & Day
  const tomorrowDateObj = new Date(currentDate);
  tomorrowDateObj.setDate(currentDate.getDate() + 1);
  const tomorrowYearStr = tomorrowDateObj.getFullYear();
  const tomorrowMonthStr = String(tomorrowDateObj.getMonth() + 1).padStart(2, '0');
  const tomorrowDayStr = String(tomorrowDateObj.getDate()).padStart(2, '0');
  const tomorrowStr = `${tomorrowYearStr}-${tomorrowMonthStr}-${tomorrowDayStr}`;
  const tomorrowDayNum = tomorrowDateObj.getDay() === 0 ? 7 : tomorrowDateObj.getDay();

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const tomorrowDayName = dayNames[tomorrowDayNum - 1];

  // Today's classes sorted chronologically
  const todayClasses = routine
    .filter(c => c.isSpecial ? c.date === todayStr : Number(c.day) === todayDayNum)
    .sort((a, b) => (a.start || '00:00').localeCompare(b.start || '00:00'));

  // Today's remaining un-logged classes (end time > current HH:MM AND not already marked)
  const remainingTodayClasses = todayClasses.filter(c => {
    const endTime = c.end || c.start || '23:59';
    const isMarked = Boolean(attendance?.[c.title]?.[todayStr]);
    return endTime > nowHHMM && !isMarked;
  });

  // Tomorrow's classes sorted chronologically
  const tomorrowClasses = routine
    .filter(c => c.isSpecial ? c.date === tomorrowStr : Number(c.day) === tomorrowDayNum)
    .sort((a, b) => (a.start || '00:00').localeCompare(b.start || '00:00'));

  // Condition to switch Overview Up Next to Tomorrow:
  // (After 4 PM (>=16) OR no remaining classes today) AND tomorrow has scheduled classes
  const isAfter4PM = nowHour >= 16;
  const noRemainingToday = remainingTodayClasses.length === 0;
  const showTomorrowUpNext = (isAfter4PM || noRemainingToday) && tomorrowClasses.length > 0;

  const displayedUpNextClasses = showTomorrowUpNext 
    ? tomorrowClasses 
    : remainingTodayClasses;

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
            <span className="text-sm font-semibold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mb-1">Target: {targetGoal}%</span>
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
            <span className="text-4xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">{streak}<span className="text-xl text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 font-medium ml-1">Days</span></span>
            <span className="text-sm font-semibold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mb-1">Streak</span>
          </div>
          <p className="mt-5 text-sm font-medium text-orange-400 group-data-[scheme=light]:text-orange-500">
            {streak > 0 ? "You're on fire! Keep it up!" : "Log class presence to build your streak!"}
          </p>
        </div>

      </div>

      {/* Today's Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Dynamic Up Next Card (Today or Tomorrow after 4 PM) */}
        <div className={`${glassPanelClass} flex flex-col h-full`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl ${showTomorrowUpNext ? 'bg-purple-500/10 text-purple-400 group-data-[scheme=light]:bg-purple-50 group-data-[scheme=light]:text-purple-600' : 'bg-white/10 text-[var(--accent)] group-data-[scheme=light]:bg-blue-50 group-data-[scheme=light]:text-blue-600'}`}>
              <CalendarClock size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">
                {showTomorrowUpNext ? `Up Next Tomorrow (${tomorrowDayName})` : 'Up Next Today'}
              </h3>
              {showTomorrowUpNext && (
                <p className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 font-medium mt-0.5">
                  Today's classes completed &bull; Showing tomorrow ({tomorrowStr})
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {displayedUpNextClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-black/[0.04]">
                <CalendarClock size={32} className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mb-3 opacity-50" />
                <p className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 font-medium">
                  {showTomorrowUpNext 
                    ? `No classes scheduled for tomorrow (${tomorrowDayName}).` 
                    : (todayClasses.length > 0 && remainingTodayClasses.length === 0 
                        ? 'All classes for today are completed or logged!' 
                        : 'No classes scheduled.')}
                </p>
              </div>
            ) : (
              displayedUpNextClasses.map((cls, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 rounded-2xl border border-white/10 group-data-[scheme=light]:border-black/[0.08] hover:border-[var(--accent)]/50 group-data-[scheme=light]:hover:border-blue-200 transition-colors group/item">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 group-hover/item:text-[var(--accent)] transition-colors">{cls.title}</h4>
                      {cls.isReplacement && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-400 group-data-[scheme=light]:bg-purple-100 group-data-[scheme=light]:text-purple-700 rounded-md">
                          ✨ Replacement
                        </span>
                      )}
                    </div>
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

        {/* Due Soon Tasks */}
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
          <div className="h-72 w-full flex items-center justify-center">
            {performanceData.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <BarChart2 size={36} className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mb-3 opacity-40" />
                <p className="text-sm font-medium text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">No subjects scheduled or attendance recorded yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 15, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10 group-data-[scheme=light]:opacity-20 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400" vertical={false} />
                  <XAxis 
                    dataKey="subject" 
                    interval={0}
                    axisLine={false} 
                    tickLine={false}
                    tick={({ x, y, payload }) => {
                      const text = payload.value || '';
                      const truncated = text.length > 10 ? text.substring(0, 8) + '…' : text;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text 
                            x={0} 
                            y={0} 
                            dy={12} 
                            textAnchor="end" 
                            fill="var(--text-secondary)" 
                            fontSize={11}
                            transform="rotate(-35)"
                            className="font-semibold"
                          >
                            {truncated}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Weekly Attendance Heatmap Grid */}
        <div className={`${glassPanelClass} flex flex-col`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Visual Attendance Grid</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {heatmapData.map((status, idx) => (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-md sm:rounded-xl transition-all duration-300 hover:scale-110 ${getHeatmapColor(status)}`}
                  title={`Day Status: ${getHeatmapLabel(status)}`}
                ></div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mt-2">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> All Attended</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span> Partially Attended</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> None Attended</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white/10 group-data-[scheme=light]:bg-gray-200 border border-white/20"></span> Inactive</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
