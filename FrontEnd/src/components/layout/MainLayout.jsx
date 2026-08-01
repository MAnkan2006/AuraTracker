import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AlertCircle, UserPlus } from 'lucide-react';
import { UserContext } from '../../context/UserContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Walkthrough from '../ui/Walkthrough';

const MainLayout = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('aura_isLightMode') === 'true';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aura_theme') || 'classic-obsidian';
  });
  const [font, setFont] = useState(() => {
    return localStorage.getItem('aura_font') || 'font-modern';
  });

  useEffect(() => {
    localStorage.setItem('aura_isLightMode', isLightMode);
    localStorage.setItem('aura_theme', theme);
    localStorage.setItem('aura_font', font);
    
    // Update Favicon based on theme
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = isLightMode ? "/assets/images/LightModeLogo.png" : "/assets/images/DarkModeLogo.png";
    }
  }, [isLightMode, theme, font]);

  return (
    <div 
      className="group relative flex h-[100dvh] bg-[#0a0f1c] data-[scheme=light]:bg-[#f8fafc] overflow-hidden transition-colors duration-500"
      data-theme={theme}
      data-scheme={isLightMode ? 'light' : 'dark'}
      data-font={font}
    >
      {/* Walkthrough Overlay */}
      <Walkthrough />

      {/* Background Blobs matching legacy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[var(--accent)] rounded-full mix-blend-screen group-data-[scheme=light]:mix-blend-multiply filter blur-[120px] opacity-15"></div>
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen group-data-[scheme=light]:mix-blend-multiply filter blur-[120px] opacity-10"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-[var(--accent-hover)] rounded-full mix-blend-screen group-data-[scheme=light]:mix-blend-multiply filter blur-[120px] opacity-10 group-data-[scheme=light]:opacity-5"></div>
      </div>

      <Sidebar isLightMode={isLightMode} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden z-10 relative">
        <Topbar 
          isLightMode={isLightMode} 
          setIsLightMode={setIsLightMode} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          theme={theme}
          setTheme={setTheme}
          font={font}
          setFont={setFont}
        />
        
        {user?.username?.toLowerCase() === 'guest' && (
          <div className="mx-4 md:mx-6 lg:mx-8 mt-4 p-4 bg-amber-500/10 border border-amber-500/20 group-data-[scheme=light]:bg-amber-50 group-data-[scheme=light]:border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">You are using a Guest account</h4>
                <p className="text-xs text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 mt-0.5">Your data is only saved locally. Register to sync across devices!</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/app/profile')}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus size={16} />
              <span>Register Now</span>
            </button>
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Outlet context={{ isLightMode, theme, setTheme, font, setFont }} />
          
          {/* Global Footer */}
          <footer className="mt-12 mb-4 text-center">
            <p className="text-[11px] font-bold tracking-wider text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 uppercase">
              AuraTracker © 2026 • Built for Students
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
