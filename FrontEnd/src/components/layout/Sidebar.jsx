import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { LayoutDashboard, ClipboardCheck, CalendarRange, CheckSquare, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isLightMode, isOpen, setIsOpen }) => {
  const { user, logout } = useContext(UserContext);

  const navItems = [
    { name: 'Overview', path: '/app', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Attendance', path: '/app/attendance', icon: <ClipboardCheck size={20} /> },
    { name: 'Routine', path: '/app/routine', icon: <CalendarRange size={20} /> },
    { name: 'Tasks', path: '/app/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <>
    {/* Mobile backdrop overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={() => setIsOpen && setIsOpen(false)}
        aria-hidden="true"
      />
    )}
    <aside className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-[280px] h-[100dvh] flex flex-col bg-[var(--bg-base)]/95 group-data-[scheme=light]:bg-white/95 backdrop-blur-xl border-r border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] transition-transform duration-300 shadow-2xl md:shadow-none pb-safe`}>
      
      {/* Brand Header */}
      <div className="flex items-center gap-4 px-6 h-20 shrink-0">
        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-xl shadow-[0_4px_15px_var(--accent-glow),inset_0_2px_4px_rgba(255,255,255,0.3)] overflow-hidden shrink-0">
          <img src={isLightMode ? "/assets/images/LightModeLogo.png" : "/assets/images/DarkModeLogo.png"} className="w-full h-full object-contain z-10" alt="AuraTracker Logo" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)] leading-none tracking-tight">
            Aura<span className="font-light bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-100">Tracker</span>
          </h1>
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 font-bold mt-1">By ManTools'</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            data-tour={item.name.toLowerCase()}
            onClick={() => setIsOpen && setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group hover:translate-x-1 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--accent)]/10 group-data-[scheme=light]:from-[var(--accent)]/5 to-transparent text-[var(--accent)] group-data-[scheme=light]:text-[var(--accent-hover)] relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-gradient-to-b before:from-[var(--accent)] before:to-[var(--accent-hover)] before:rounded-r-full before:shadow-[0_0_10px_var(--accent-glow)]'
                  : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Unified User Footer */}
      <div className="p-4 shrink-0 pb-6 md:pb-4">
        <div className="bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-2xl p-3 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0">
              {user ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 truncate">
                {user ? user.name : 'Student Name'}
              </span>
              <span className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 truncate">
                @{user ? user.username : 'student'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-data-[scheme=light]:border-black/[0.08]">
            <NavLink 
              to="/app/profile"
              data-tour="profile"
              className={({ isActive }) => `flex-1 flex justify-center items-center py-2 rounded-xl transition-colors ${isActive ? 'bg-[var(--accent)] text-white shadow-[0_2px_8px_var(--accent-glow)]' : 'text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900'}`}
              title="Profile Settings"
            >
              <Settings size={18} />
            </NavLink>
            <button 
              onClick={logout}
              className="flex-1 flex justify-center items-center py-2 rounded-xl text-red-400 group-data-[scheme=light]:text-red-500 hover:bg-red-400/10 group-data-[scheme=light]:hover:bg-red-500/10 hover:text-red-300 active:scale-95 transition-colors"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
