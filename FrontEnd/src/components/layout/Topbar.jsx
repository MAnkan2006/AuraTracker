import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../../hooks/useAttendance';
import { useTasks } from '../../hooks/useTasks';
import { useRoutine } from '../../hooks/useRoutine';
import { 
  Bell, Search, Sun, Moon, ChevronDown, Menu, 
  AlertCircle, Settings, User, LogOut, Palette, ChevronRight, 
  Coffee, Flame, BookOpen, CheckSquare 
} from 'lucide-react';
import Dropdown from '../ui/Dropdown';

const Topbar = ({ isLightMode, setIsLightMode, setIsMobileMenuOpen, theme, setTheme, font, setFont }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [bellRing, setBellRing] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const prevUnreadCount = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { getStats, getStreak } = useAttendance();
  const { tasks } = useTasks();
  const { routine } = useRoutine();

  const stats = getStats();
  const streak = getStreak();
  const pendingTasks = tasks.filter(t => !t.completed);

  // Today's classes
  const currentDate = new Date();
  const todayDayNum = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
  const yearStr = currentDate.getFullYear();
  const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${yearStr}-${monthStr}-${dayStr}`;

  const todayClasses = routine
    .filter(c => c.isSpecial ? c.date === todayStr : Number(c.day) === todayDayNum)
    .sort((a, b) => (a.start || '00:00').localeCompare(b.start || '00:00'));

  const { appState, updateAppState } = useContext(AppContext);
  const readNotifIds = Array.isArray(appState?.readNotifIds) ? appState.readNotifIds : [];

  // Generate real-time notifications list
  const generatedNotifications = [];

  if (user && stats.total > 0 && stats.percentage < (user.targetGoal || 75)) {
    generatedNotifications.push({
      id: 'low-attendance',
      type: 'alert',
      title: 'Low Attendance Alert',
      message: `Your overall attendance is currently ${stats.percentage}%, below your ${user.targetGoal || 75}% target.`,
      time: 'Attention needed'
    });
  }

  if (streak >= 3) {
    generatedNotifications.push({
      id: 'streak-active',
      type: 'success',
      title: `🔥 ${streak}-Day Streak Active!`,
      message: `Great job! You've logged attendance for ${streak} consecutive active days.`,
      time: 'Active now'
    });
  }

  if (todayClasses.length > 0) {
    generatedNotifications.push({
      id: 'today-classes',
      type: 'schedule',
      title: `${todayClasses.length} Class${todayClasses.length > 1 ? 'es' : ''} Today`,
      message: `First class: ${todayClasses[0].title} (${todayClasses[0].start} - ${todayClasses[0].end})`,
      time: 'Today'
    });
  }

  if (pendingTasks.length > 0) {
    generatedNotifications.push({
      id: 'pending-tasks',
      type: 'info',
      title: `${pendingTasks.length} Pending Task${pendingTasks.length > 1 ? 's' : ''}`,
      message: `Next task due: "${pendingTasks[0].text}"`,
      time: 'Due soon'
    });
  }

  if (user && user.username?.toLowerCase() !== 'guest' && (!user.name || user.name === '')) {
    generatedNotifications.push({
      id: 'incomplete-profile',
      type: 'info',
      title: 'Complete Profile',
      message: 'Update your name in settings to personalize your tracker experience.',
      time: 'System'
    });
  }

  const notificationsWithRead = generatedNotifications.map(n => ({
    ...n,
    unread: !readNotifIds.includes(n.id)
  }));

  const unreadCount = notificationsWithRead.filter(n => n.unread).length;
  const hasUnread = unreadCount > 0;

  // Ring bell animation when unread count increases
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      setBellRing(true);
      const t = setTimeout(() => setBellRing(false), 700);
      return () => clearTimeout(t);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  const handleMarkAllRead = () => {
    const allIds = generatedNotifications.map(n => n.id);
    const combined = Array.from(new Set([...readNotifIds, ...allIds]));
    updateAppState({ readNotifIds: combined });
  };

  const handleToggleRead = (id) => {
    const updated = readNotifIds.includes(id)
      ? readNotifIds.filter(i => i !== id)
      : [...readNotifIds, id];
    updateAppState({ readNotifIds: updated });
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'alert':
        return <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-500/10 text-red-500"><AlertCircle size={16} /></div>;
      case 'success':
        return <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-500/10 text-green-500"><Flame size={16} /></div>;
      case 'schedule':
        return <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-400"><BookOpen size={16} /></div>;
      default:
        return <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500"><CheckSquare size={16} /></div>;
    }
  };

  return (
    <header className="h-[72px] shrink-0 bg-white/5 group-data-[scheme=light]:bg-white/40 backdrop-blur-md border-b border-white/10 group-data-[scheme=light]:border-black/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.1)] group-data-[scheme=light]:shadow-sm flex items-center justify-between px-6 z-40 sticky top-0 transition-all duration-300">
      
      {/* Left: Greeting + Search */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-black/[0.08] text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 shadow-sm transition-all hover:bg-white/10 active:scale-95"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">Welcome back</span>
          <span className="text-[15px] font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-tight">
            {user ? (user.name || user.username || 'Student').split(' ')[0] : 'Student'}
          </span>
        </div>
        
        <div className="relative group/search hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 group-hover/search:text-[var(--accent)] transition-colors" />
          <input 
            ref={searchRef}
            type="text" 
            placeholder="Search classes, tasks..." 
            className="w-64 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-xl pl-9 pr-12 py-2 text-sm text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 placeholder-[var(--text-muted)] group-data-[scheme=light]:placeholder-gray-400 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:bg-white/10 group-data-[scheme=light]:focus:bg-white transition-all shadow-inner group-data-[scheme=light]:shadow-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center justify-center px-1.5 h-5 text-[10px] font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-3 relative">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition-all active:scale-95 shadow-sm ${isNotificationsOpen ? 'bg-white/10 border-white/20 text-[var(--text-primary)] group-data-[scheme=light]:bg-gray-100 group-data-[scheme=light]:border-gray-300 group-data-[scheme=light]:text-gray-900' : 'bg-white/5 group-data-[scheme=light]:bg-white border-white/10 group-data-[scheme=light]:border-black/[0.08] text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900'}`}
          >
            <Bell className={`w-5 h-5 ${bellRing ? 'animate-[bell-ring_0.6s_ease-in-out]' : ''}`} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] border-2 border-[var(--bg-base)] group-data-[scheme=light]:border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div 
              style={{ backgroundColor: 'var(--popover-bg)' }}
              className="fixed inset-x-4 top-16 sm:absolute sm:top-auto sm:inset-auto sm:right-0 sm:mt-3 sm:w-96 group-data-[scheme=light]:!bg-white backdrop-blur-2xl border border-white/15 group-data-[scheme=light]:border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 group-data-[scheme=light]:border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[var(--accent)]/20 text-[var(--accent)] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {hasUnread && (
                  <button onClick={handleMarkAllRead} className="text-xs font-bold text-[var(--accent)] hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notificationsWithRead.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-white/5 group-data-[scheme=light]:bg-gray-100 flex items-center justify-center text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mb-1">
                      <Coffee size={24} />
                    </div>
                    <span className="font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">You're all caught up!</span>
                    <span className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400">No active alerts or reminders right now.</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notificationsWithRead.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => handleToggleRead(notif.id)}
                        className={`p-4 border-b border-white/5 group-data-[scheme=light]:border-gray-100 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-50 transition-colors cursor-pointer relative ${notif.unread ? 'bg-white/[0.03] group-data-[scheme=light]:bg-blue-50/50' : 'opacity-70'}`}
                      >
                        {notif.unread && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent)] rounded-r-full"></div>}
                        <div className="flex gap-3 pl-2">
                          {getNotifIcon(notif.type)}
                          <div className="flex flex-col gap-1 pr-2">
                            <span className={`text-sm font-bold ${notif.unread ? 'text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900' : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600'}`}>
                              {notif.title}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 leading-snug">
                              {notif.message}
                            </span>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 mt-1 uppercase tracking-wider">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-white/10 group-data-[scheme=light]:border-gray-100 bg-white/5 group-data-[scheme=light]:bg-gray-50 text-center flex justify-between items-center px-4">
                <span className="text-[11px] font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">
                  {notificationsWithRead.length} Total Alerts
                </span>
                {hasUnread && (
                  <button onClick={handleMarkAllRead} className="text-xs font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-700 hover:text-[var(--accent)] transition-colors">
                    Dismiss Unread
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsLightMode(!isLightMode)} 
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-black/[0.08] text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 transition-all shadow-sm"
          title="Toggle Light/Dark Mode"
        >
          {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <div className="w-px h-6 bg-white/10 group-data-[scheme=light]:bg-black/[0.08] mx-1"></div>

        <div className="relative" ref={profileRef} data-tour="theme">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm border ${isProfileOpen ? 'bg-white/10 border-white/20 group-data-[scheme=light]:bg-gray-100 group-data-[scheme=light]:border-gray-300' : 'bg-white/5 group-data-[scheme=light]:bg-white border-white/10 group-data-[scheme=light]:border-black/[0.08] hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50'}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
               {user ? (user.username || user.name || 'U').charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-none">
                {user ? (user.name || user.username || 'Student') : 'Student'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div 
              style={{ backgroundColor: 'var(--popover-bg)' }}
              className="absolute right-0 mt-3 w-56 group-data-[scheme=light]:!bg-white backdrop-blur-2xl border border-white/15 group-data-[scheme=light]:border-gray-200 rounded-2xl shadow-2xl z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="p-4 border-b border-white/10 group-data-[scheme=light]:border-gray-100">
                <div className="font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 truncate">{user ? (user.name || user.username || 'Student') : 'Student'}</div>
                <div className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 truncate">@{user ? user.username : 'student'}</div>
              </div>
              
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/app/profile');
                  }}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl text-left text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-700 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-100 transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>
                <div className="flex flex-col">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAppearanceOpen(!isAppearanceOpen);
                    }}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl text-left text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-700 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Palette size={16} />
                      Appearance
                    </div>
                    <ChevronRight size={14} className={`transition-transform duration-200 ${isAppearanceOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {isAppearanceOpen && (
                    <div className="px-2 pb-2 pt-1 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">

                      
                      <div className="flex flex-col gap-1.5 px-2">
                        <span className="text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase">Theme</span>
                        <Dropdown
                          value={theme}
                          onChange={(val) => {
                            setTheme(val);
                          }}
                          options={[
                            { value: 'classic-obsidian', label: 'Classic Obsidian' },
                            { value: 'cyberpunk-onyx', label: 'Cyberpunk Onyx' },
                            { value: 'emerald-deep', label: 'Emerald Deep' },
                            { value: 'nebula-cosmic', label: 'Nebula Cosmic' },
                            { value: 'sunset-crimson', label: 'Sunset Crimson' },
                            { value: 'nordic-frost', label: 'Nordic Frost' },
                            { value: 'amber-gold', label: 'Amber Gold' }
                          ]}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5 px-2">
                        <span className="text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase">Font</span>
                        <Dropdown
                          value={font}
                          onChange={(val) => {
                            setFont(val);
                          }}
                          options={[
                            { value: 'font-modern', label: 'Modern Sans' },
                            { value: 'font-clean', label: 'Geometric' },
                            { value: 'font-cyber', label: 'Cyber Sora' },
                            { value: 'font-minimalist', label: 'Minimalist Pop' },
                            { value: 'font-funky', label: 'Trendy Bricolage' },
                            { value: 'font-tech', label: 'Tech Mono' },
                            { value: 'font-elegant', label: 'Classic Serif' }
                          ]}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/app/profile');
                  }}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl text-left text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-700 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-100 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>
              </div>
              
              <div className="p-2 border-t border-white/10 group-data-[scheme=light]:border-gray-100">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (logout) logout();
                  }}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl text-left text-sm font-bold text-red-400 group-data-[scheme=light]:text-red-600 hover:bg-red-400/10 group-data-[scheme=light]:hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Topbar;
