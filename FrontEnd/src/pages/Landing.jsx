import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, ArrowRight, CheckCircle2, Calendar, ListTodo, Sparkles, Activity, Palette, LayoutDashboard, CalendarCheck, Clock, CheckSquare, AlertTriangle, TrendingUp, Grid, ShieldAlert, ChevronRight, ChevronLeft, Type, Database, Info } from 'lucide-react';

const Landing = () => {
  const [theme, setTheme] = useState('classic-obsidian');
  const [font, setFont] = useState('font-modern');
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('aura_isLightMode') === 'true';
  });
  const [activeTab, setActiveTab] = useState('tour-overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_isLightMode', isLightMode);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font', font);
    if (isLightMode) {
      document.documentElement.setAttribute('data-scheme', 'light');
    } else {
      document.documentElement.removeAttribute('data-scheme');
    }

    // Update Favicon based on theme
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = isLightMode ? "/assets/images/LightModeLogo.png" : "/assets/images/DarkModeLogo.png";
    }

    return () => {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-font');
      document.documentElement.removeAttribute('data-scheme');
    };
  }, [theme, font, isLightMode]);

  const renderTourContent = (tabId) => {
    switch(tabId) {
      case 'tour-overview':
        return (
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-lg mb-4">Tab 1: Overview</span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Your Complete Academic Pulse</h3>
              <p className="text-[var(--text-muted)] mb-8">Get a bird's-eye view of your productivity metrics, streaks, and schedules in one cohesive control center.</p>
              <ul className="flex flex-col gap-5">
                <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-[var(--accent)] shrink-0" /><span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Executive Summaries:</strong> Real-time averages, active streak counts, and pending tasks.</span></li>
                <li className="flex gap-4"><TrendingUp className="w-6 h-6 text-[var(--accent)] shrink-0" /><span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Cumulative Trends:</strong> Glowing visualizations tracking attendance fluctuations.</span></li>
                <li className="flex gap-4"><Grid className="w-6 h-6 text-[var(--accent)] shrink-0" /><span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Visual Activity Heatmap:</strong> GitHub-style glowing activity boxes.</span></li>
              </ul>
            </div>
            <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-2xl p-6 shadow-xl">
              <div className="flex gap-2 mb-6"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-4 rounded-xl border border-white/5 group-data-[scheme=light]:border-black/[0.06]"><div className="text-xs text-[var(--text-muted)] mb-1">Avg Attendance</div><div className="text-2xl font-bold text-[var(--accent)]">94%</div></div>
                <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-4 rounded-xl border border-white/5 group-data-[scheme=light]:border-black/[0.06]"><div className="text-xs text-[var(--text-muted)] mb-1">Max Streak</div><div className="text-2xl font-bold text-amber-500">18 Days 🔥</div></div>
              </div>
              <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-4 rounded-xl border border-white/5 group-data-[scheme=light]:border-black/[0.06] h-32 flex items-end justify-center text-[var(--text-muted)] text-sm">Attendance Trend (30 Days)</div>
            </div>
          </div>
        );
      case 'tour-attendance':
        return (
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-lg mb-4">Tab 2: Attendance</span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Registry & Specific Subject Analytics</h3>
              <p className="text-[var(--text-muted)] mb-8">Track attendance metrics dynamically per subject. Complete logs with individual calendar registries.</p>
              <ul className="flex flex-col gap-5">
                <li className="flex gap-4"><Calendar className="w-6 h-6 text-[var(--accent)] shrink-0" /><span className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Interactive Calendars:</strong> Add presents, absents, lates directly.</span></li>
              </ul>
            </div>
            <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-2xl p-6 shadow-xl">
              <div className="flex gap-2 mb-6"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
              <div className="text-sm font-bold text-[var(--text-primary)] mb-4">Class Attendance: Mathematics</div>
              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-2 rounded-lg"><div className="text-[10px] text-[var(--text-muted)]">Presents</div><div className="text-lg font-bold text-green-500">14</div></div>
                <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-2 rounded-lg"><div className="text-[10px] text-[var(--text-muted)]">Lates</div><div className="text-lg font-bold text-amber-500">2</div></div>
                <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-2 rounded-lg"><div className="text-[10px] text-[var(--text-muted)]">Absents</div><div className="text-lg font-bold text-red-500">1</div></div>
              </div>
            </div>
          </div>
        );
      case 'tour-routine':
        return (
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-lg mb-4">Tab 3: Weekly Routine</span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Dual Scope Timeline</h3>
              <p className="text-[var(--text-muted)] mb-8">Plan your week in detail. Manage classes, study sessions, routines, and habits side-by-side.</p>
            </div>
            <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-2xl p-6 shadow-xl">
              <div className="flex gap-2 mb-6"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4"><span className="text-xs text-[var(--text-muted)] w-16">09:00 AM</span><div className="flex-1 bg-[var(--accent)]/10 border-l-4 border-[var(--accent)] text-[var(--accent)] p-3 rounded-r-lg text-sm font-bold">Physics Lecture</div></div>
                <div className="flex items-center gap-4"><span className="text-xs text-[var(--text-muted)] w-16">11:30 AM</span><div className="flex-1 bg-green-500/10 border-l-4 border-green-500 text-green-400 p-3 rounded-r-lg text-sm font-bold">Data Structures</div></div>
                <div className="flex items-center gap-4"><span className="text-xs text-[var(--text-muted)] w-16">03:00 PM</span><div className="flex-1 bg-amber-500/10 border-l-4 border-amber-500 text-amber-400 p-3 rounded-r-lg text-sm font-bold">Gym Workout</div></div>
              </div>
            </div>
          </div>
        );
      case 'tour-todo':
        return (
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-lg mb-4">Tab 4: Tasks & To-Dos</span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Action-Oriented Task Board</h3>
              <p className="text-[var(--text-muted)] mb-8">Stay on top of deadlines. Manage tasks and to-dos, categorized by urgency and day.</p>
            </div>
            <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-2xl p-6 shadow-xl">
              <div className="flex gap-2 mb-6"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-3 rounded-lg border border-white/5 group-data-[scheme=light]:border-black/[0.06]"><div className="flex items-center gap-3"><CheckSquare className="w-5 h-5 text-[var(--accent)]"/><span className="text-sm text-[var(--text-secondary)] line-through">Math Assignment</span></div><span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">Urgent</span></div>
                <div className="flex items-center justify-between bg-white/5 group-data-[scheme=light]:bg-black/[0.03] p-3 rounded-lg border border-white/5 group-data-[scheme=light]:border-black/[0.06]"><div className="flex items-center gap-3"><div className="w-5 h-5 border border-[var(--text-muted)] rounded"></div><span className="text-sm text-[var(--text-primary)]">Read Chapter 4</span></div><span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Normal</span></div>
              </div>
            </div>
          </div>
        );
      case 'tour-appearance':
        return (
          <div className="grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1 rounded-lg mb-4">Settings & Appearance</span>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Tailored Workspace Aesthetics</h3>
              <p className="text-[var(--text-muted)] mb-8">Customize your workspace to match your style. Real-time theme switches and typeface selections.</p>
            </div>
            <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-2xl p-6 shadow-xl flex items-center justify-center">
              <Palette className="w-24 h-24 text-[var(--accent)] opacity-50" />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="group relative overflow-x-hidden" data-scheme={isLightMode ? 'light' : 'dark'}>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header Navbar */}
      <header className="sticky top-0 left-0 right-0 bg-white/5 group-data-[scheme=light]:bg-black/[0.03] backdrop-blur-md border-b border-white/10 group-data-[scheme=light]:border-black/[0.12] z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-[var(--text-primary)] font-[var(--font-heading)] text-2xl font-extrabold tracking-tight no-underline">
            <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-xl overflow-hidden shadow-[0_4px_15px_var(--accent-glow),inset_0_2px_4px_rgba(255,255,255,0.3)]">
              <img src={isLightMode ? "/assets/images/LightModeLogo.png" : "/assets/images/DarkModeLogo.png"} className="w-full h-full object-contain z-10 block" alt="AuraTracker Logo" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <span className="text-[var(--text-primary)] leading-none">
                Aura<span className="font-light bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-90">Tracker</span>
              </span>
              <span className="text-[9px] uppercase font-extrabold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-1.5 py-0.5 rounded-md tracking-wider mt-0.5 ml-0.5 md:mt-0 md:ml-2 w-fit">By ManTools'</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Features</a>
            <a href="#tour" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Capabilities</a>
            <a href="#demo" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Themes Demo</a>
            <a href="#pricing" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Pricing</a>
            <Link to="/login" className="text-sm font-bold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-5 py-2.5 rounded-full shadow-[0_4px_15px_var(--accent-glow)] hover:shadow-[0_6px_20px_var(--accent-glow)] hover:-translate-y-0.5 transition-all">Login / Signup</Link>
          </nav>

          {/* Nav Right */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsLightMode(!isLightMode)} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-white/10 group-data-[scheme=light]:bg-black/[0.06] hover:text-[var(--text-primary)] transition-all">
              {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-transparent border border-transparent hover:bg-white/5 group-data-[scheme=light]:bg-black/[0.03] text-[var(--text-primary)] relative z-50">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-[var(--bg-base)] z-40 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <nav className="flex flex-col gap-6 px-6 py-8">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className={`font-[var(--font-heading)] text-2xl font-bold text-[var(--text-primary)] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-6 opacity-0'}`}>Features</a>
            <a href="#tour" onClick={() => setIsMobileMenuOpen(false)} className={`font-[var(--font-heading)] text-2xl font-bold text-[var(--text-primary)] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-6 opacity-0'}`}>Capabilities</a>
            <a href="#demo" onClick={() => setIsMobileMenuOpen(false)} className={`font-[var(--font-heading)] text-2xl font-bold text-[var(--text-primary)] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-6 opacity-0'}`}>Themes Demo</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className={`font-[var(--font-heading)] text-2xl font-bold text-[var(--text-primary)] transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-6 opacity-0'}`}>Pricing</a>
            <div className={`h-px bg-[var(--card-border)] my-2 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 delay-300' : 'opacity-0'}`}></div>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`text-center font-bold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-5 py-4 rounded-xl shadow-[0_4px_15px_var(--accent-glow)] mt-4 transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100 delay-[350ms]' : 'translate-y-6 opacity-0'}`}>Login / Signup</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-36 md:pb-40 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">
        <div className="flex-1 flex flex-col items-center md:items-start max-w-2xl text-center md:text-left">
          <div className="self-center md:self-start inline-flex items-center gap-3 bg-white/5 group-data-[scheme=light]:bg-[var(--card-bg)] border border-white/10 group-data-[scheme=light]:border-black/[0.08] px-4 py-2 rounded-full mb-8 backdrop-blur-md shadow-lg group-data-[scheme=light]:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
            <span className="text-[10px] uppercase font-bold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-2 py-0.5 rounded-full shadow-[0_2px_8px_var(--accent-glow)]">New Release</span>
            <span className="text-sm font-bold text-[var(--text-secondary)]">AuraTracker v2.0 is now live</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[var(--text-primary)] font-[var(--font-heading)] leading-[1.1] tracking-tight mb-6">
            Master Your Time, <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] filter drop-shadow-[0_0_20px_var(--accent-glow)] group-data-[scheme=light]:drop-shadow-[0_4px_15px_var(--accent-glow)]">Own Your Routine</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-xl">
            A premium glassmorphic tracking assistant designed for high-achievers. Maintain attendance streaks, manage weekly routines, and execute prioritize-based to-dos in one cohesive, themeable console.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
            <Link to="/login" className="flex items-center justify-center gap-2 text-base font-bold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-8 py-4 rounded-xl shadow-[0_4px_20px_var(--accent-glow)] group-data-[scheme=light]:shadow-[0_8px_30px_var(--accent-glow)] hover:shadow-[0_8px_25px_var(--accent-glow)] hover:-translate-y-1 transition-all border border-[var(--card-border)]">
              Login / Signup <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="flex items-center justify-center text-base font-bold text-[var(--text-primary)] bg-white/5 group-data-[scheme=light]:bg-white/60 px-8 py-4 rounded-xl border border-white/10 group-data-[scheme=light]:border-black/[0.08] hover:bg-white/10 group-data-[scheme=light]:hover:bg-white/90 group-data-[scheme=light]:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all backdrop-blur-md">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="flex-1 w-full max-w-[600px] lg:max-w-none [perspective:1000px] animate-float">
          <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_var(--card-border-glow)] backdrop-blur-xl overflow-hidden transition-transform duration-700 ease-out [transform:rotateY(-5deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)]">
            {/* Frame Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border-b border-white/5 group-data-[scheme=light]:border-black/[0.06]">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-[11px] text-[var(--text-muted)] font-medium ml-2 font-[var(--font-mono)]">AuraTracker - Dashboard Console</div>
            </div>
            {/* Frame Content */}
            <div className="flex min-h-[380px] sm:h-[400px]">
              {/* Sidebar */}
              <div className="w-[100px] sm:w-[140px] border-r border-white/5 group-data-[scheme=light]:border-black/[0.06] p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-[var(--accent)] bg-[var(--accent)]/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium border border-[var(--accent)]/20 shadow-[0_0_15px_var(--accent-glow)]">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">Attendance</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-[var(--text-muted)] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">Routine</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-[var(--text-muted)] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium">
                  <ListTodo className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">Tasks</span>
                </div>
              </div>
              {/* Main Content Mockup */}
              <div className="flex-1 p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 bg-white/[0.02]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1 sm:mb-2 font-semibold">Attendance Rate</div>
                    <div className="text-xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-[var(--font-heading)] mb-2 sm:mb-3">92.4%</div>
                    <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--accent)] to-green-400 w-[92.4%] rounded-full shadow-[0_0_10px_var(--accent)]"></div>
                    </div>
                  </div>
                  <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1 sm:mb-2 font-semibold">Streak Status</div>
                    <div className="text-lg sm:text-2xl font-extrabold text-amber-500 font-[var(--font-heading)] mb-1 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] whitespace-nowrap">14 Days 🔥</div>
                    <div className="text-[9px] sm:text-xs text-[var(--text-muted)] truncate">Highest this semester</div>
                  </div>
                </div>
                <div className="bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-xl p-4 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">June 2026</span>
                    <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full font-bold uppercase tracking-wider">9 Present</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="aspect-square rounded-md bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-[1400px] mx-auto px-6 py-24 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] font-[var(--font-heading)] mb-6">Designed for Visual Control</h2>
          <p className="text-lg text-[var(--text-secondary)]">Say goodbye to boring forms and basic lists. Experience an interface that reacts to your touch and keeps you focused.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Sparkles, title: "Custom Dropdowns", desc: "Upgraded premium dropdown overlays replacing default boring select menus with animated, blur-backed selection triggers." },
            { icon: Calendar, title: "Weekly Routines", desc: "A 7-day responsive routine slot system designed to schedule classes, habits, and tasks with responsive tags." },
            { icon: Activity, title: "Smart Attendance", desc: "Track attendance metrics dynamically per class. View calendars, streaks, rates, and summaries without page updates." },
            { icon: Palette, title: "Custom Themes", desc: "Switch between 7 premium dark themes and 7 modern typography presets to fully personalize your dashboard." }
          ].map((feat, i) => (
            <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl backdrop-blur-lg hover:border-[var(--accent)] hover:shadow-[0_10px_40px_var(--card-border-glow)] hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white flex items-center justify-center mb-6 shadow-[0_4px_15px_var(--accent-glow)]">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{feat.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Tour Section */}
      <section id="tour" className="max-w-[1400px] mx-auto px-6 py-24 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] font-[var(--font-heading)] mb-6">Deep Dive Into AuraTracker Capabilities</h2>
          <p className="text-lg text-[var(--text-secondary)]">Explore the professional-grade toolsets that power your daily academic and routine organization.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Desktop Tour Tabs Sidebar */}
          <div className="hidden lg:flex w-72 flex-col gap-2">
            {[
              { id: 'tour-overview', icon: LayoutDashboard, label: 'Overview Dashboard' },
              { id: 'tour-attendance', icon: CalendarCheck, label: 'Attendance Registry' },
              { id: 'tour-routine', icon: Clock, label: 'Weekly Routine' },
              { id: 'tour-todo', icon: ListTodo, label: 'Tasks & To-Dos' },
              { id: 'tour-appearance', icon: Palette, label: 'Themes & Appearance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-left transition-all ${activeTab === tab.id ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-[0_4px_20px_var(--accent-glow)]' : 'bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-white/5 group-data-[scheme=light]:bg-black/[0.03] hover:text-[var(--text-primary)]'}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Desktop Tour Content Area */}
          <div className="hidden lg:block flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-12 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            {renderTourContent(activeTab)}
          </div>

          {/* Mobile Tour Accordion */}
          <div className="flex flex-col gap-3 lg:hidden w-full">
            {[
              { id: 'tour-overview', icon: LayoutDashboard, label: 'Overview Dashboard' },
              { id: 'tour-attendance', icon: CalendarCheck, label: 'Attendance Registry' },
              { id: 'tour-routine', icon: Clock, label: 'Weekly Routine' },
              { id: 'tour-todo', icon: ListTodo, label: 'Tasks & To-Dos' },
              { id: 'tour-appearance', icon: Palette, label: 'Themes & Appearance' },
            ].map(tab => (
              <div key={tab.id} className="w-full flex flex-col items-center">
                <button 
                  onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)} 
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl font-bold text-sm transition-all border ${activeTab === tab.id ? 'bg-[var(--accent)] text-white border-transparent shadow-[0_4px_15px_var(--accent-glow)]' : 'bg-white/5 group-data-[scheme=light]:bg-black/[0.03] text-[var(--text-secondary)] border-white/5 group-data-[scheme=light]:border-black/[0.06] hover:bg-white/10 group-data-[scheme=light]:bg-black/[0.06]'}`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  {/* Chevron Icon indicating expanded state */}
                  <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${activeTab === tab.id ? 'rotate-90 text-white' : 'text-[var(--text-secondary)]'}`} />
                </button>
                
                {/* Accordion Content Drawer */}
                <div className={`w-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === tab.id ? 'max-h-[1200px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                    {renderTourContent(tab.id)}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Theme Demo Section */}
      <section id="demo" className="max-w-[1400px] mx-auto px-6 py-20 z-10 relative">
        <div className="flex flex-col lg:flex-row gap-10 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] font-[var(--font-heading)] mb-2">Test Drive the Aesthetics</h2>
            <p className="text-[var(--text-muted)] mb-8">AuraTracker adapts to your style. Switch themes below to see the landing page background and accent colors transform instantly.</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { id: 'classic-obsidian', name: 'Classic Obsidian', color: '#6366f1' },
                { id: 'cyberpunk-onyx', name: 'Cyberpunk Onyx', color: '#ff007f' },
                { id: 'emerald-deep', name: 'Emerald Deep', color: '#10b981' },
                { id: 'nebula-cosmic', name: 'Nebula Cosmic', color: '#8b5cf6' },
                { id: 'sunset-crimson', name: 'Sunset Crimson', color: '#f43f5e' },
                { id: 'nordic-frost', name: 'Nordic Frost', color: '#0ea5e9' },
                { id: 'amber-gold', name: 'Amber Gold', color: '#f59e0b' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${theme === t.id ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] text-[var(--text-primary)]' : 'bg-transparent border-white/5 group-data-[scheme=light]:border-black/[0.06] hover:border-[var(--card-border)] text-[var(--text-secondary)]'}`}
                >
                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: t.color, color: t.color }}></div>
                  <span className="text-xs font-bold">{t.name}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-3">Test Drive the Fonts</div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'font-modern', label: 'Modern Sans' },
                { id: 'font-clean', label: 'Geometric' },
                { id: 'font-cyber', label: 'Cyber Sora' },
                { id: 'font-minimalist', label: 'Minimalist Pop' },
                { id: 'font-funky', label: 'Trendy Bricolage' },
                { id: 'font-tech', label: 'Tech Mono' },
                { id: 'font-elegant', label: 'Classic Serif' },
              ].map(f => (
                <button
                  key={f.id}
                  data-font={f.id}
                  onClick={() => setFont(f.id)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${font === f.id ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--text-primary)] shadow-[0_0_15px_var(--accent-glow)]' : 'bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border-white/10 group-data-[scheme=light]:border-black/[0.12] text-[var(--text-secondary)] hover:bg-white/10 group-data-[scheme=light]:bg-black/[0.06] hover:text-[var(--text-primary)]'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-80 bg-white/5 group-data-[scheme=light]:bg-black/[0.03] border border-white/10 group-data-[scheme=light]:border-black/[0.12] rounded-2xl p-6 self-start relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[var(--accent)]/20 to-transparent w-full h-full pointer-events-none"></div>
            <div className="text-[10px] font-bold text-white bg-[var(--accent)] px-2 py-1 rounded inline-block mb-4 shadow-[0_2px_10px_var(--accent-glow)]">Live Preview</div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-[var(--font-heading)]">Accent Preview Widget</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">This box demonstrates how colors and elements glow in response to your theme selections.</p>
            <div className="h-1.5 w-full bg-black/40 rounded-full mb-6 overflow-hidden">
               <div className="h-full w-[75%] bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)] rounded-full transition-all duration-300"></div>
            </div>
            <button className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-bold text-sm shadow-[0_4px_15px_var(--accent-glow)] hover:opacity-90 transition-all">Sample Accent Button</button>
          </div>
        </div>
      </section>

      {/* Visual Comparison & Analytics Section */}
      <section id="analytics" className="max-w-[1400px] mx-auto px-6 py-20 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] font-[var(--font-heading)] mb-6">Local-First Speed & Autonomy</h2>
          <p className="text-lg text-[var(--text-secondary)]">Compare the performance and ownership statistics of AuraTracker's architecture compared to traditional cloud tools.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Performance Bar Chart */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Response Latency (Lower is Better)</h3>
            <div className="flex flex-col gap-6 mb-8">
              <div>
                 <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2"><span>Local Storage</span><span>0.1ms</span></div>
                 <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[5%] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div></div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2"><span>Self-Hosted DB</span><span>8ms</span></div>
                 <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-[var(--accent)] w-[15%] rounded-full shadow-[0_0_8px_var(--accent-glow)]"></div></div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2"><span>Standard Cloud API</span><span>250ms</span></div>
                 <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[90%] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div></div>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)]">Local-first updates run near-instantaneously without waiting for network handshakes.</p>
          </div>
          {/* Donut Chart */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 backdrop-blur-xl">
             <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Data Security & Control Breakdown</h3>
             <div className="flex items-center gap-8 mb-8">
               <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path className="text-red-500/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[var(--accent)] drop-shadow-[0_0_4px_var(--accent)]" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-[var(--text-primary)] font-[var(--font-heading)]">100%</div>
               </div>
               <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium"><div className="w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]"></div> Local & Self-Hosted Ownership</div>
                 <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium opacity-50"><div className="w-3 h-3 rounded-full bg-red-500"></div> Third-Party Data Leak Risk</div>
               </div>
             </div>
             <p className="text-sm text-[var(--text-muted)]">Your credentials, streaks, and schedules never leave your control.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1400px] mx-auto px-6 py-24 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] font-[var(--font-heading)] mb-6">Free for Everyone</h2>
          <p className="text-lg text-[var(--text-secondary)]">AuraTracker is local-first, privacy-respecting, and completely free to use.</p>
        </div>
        <div className="max-w-md mx-auto">
          {/* Community Edition Plan */}
          <div className="bg-[var(--card-bg)] border border-[var(--accent)] rounded-3xl p-8 backdrop-blur-xl shadow-[0_10px_40px_var(--accent-glow)] relative text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white text-xs font-bold px-4 py-1 rounded-full shadow-[0_2px_10px_var(--accent-glow)]">Self-Hosted / Local</div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 mt-2">Community Edition</h3>
            <div className="text-5xl font-extrabold text-[var(--accent)] mb-6 font-[var(--font-heading)] filter drop-shadow-[0_0_10px_var(--accent-glow)]">$0 <span className="text-lg text-[var(--text-muted)] font-normal">/ lifetime</span></div>
            <p className="text-[var(--text-secondary)] mb-8 text-sm">No credit card, no server-side telemetry, no subscriptions.</p>
            <ul className="flex flex-col gap-4 mb-8 text-left">
              <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="w-5 h-5 text-[var(--accent)]" /> <span>Self-Hosted Database Sync (MongoDB & Local)</span></li>
              <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="w-5 h-5 text-[var(--accent)]" /> <span>All 7 Premium Glass Themes</span></li>
              <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="w-5 h-5 text-[var(--accent)]" /> <span>Guest Mode & Profile Exports</span></li>
              <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="w-5 h-5 text-[var(--accent)]" /> <span>All Custom Dropdowns & Interactions</span></li>
            </ul>
            <Link to="/register" className="block text-center w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-hover)] shadow-[0_4px_15px_var(--accent-glow)] hover:shadow-[0_6px_20px_var(--accent-glow)] hover:-translate-y-1 transition-all">Get Started Now</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 z-10 relative">
        <div className="relative bg-gradient-to-r from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)] border border-[var(--card-border)] rounded-3xl p-12 overflow-hidden text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-[var(--accent-glow)] opacity-20 blur-3xl"></div>
          <h2 className="relative text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] font-[var(--font-heading)] mb-6">Ready to take control?</h2>
          <p className="relative text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">Join thousands of high-achievers who have upgraded their academic workflow with AuraTracker.</p>
          <Link to="/register" className="relative inline-flex items-center gap-2 bg-[var(--accent)] text-white font-bold text-lg px-10 py-4 rounded-xl shadow-[0_10px_30px_var(--accent-glow)] hover:scale-105 hover:bg-[var(--accent-hover)] transition-all">Start Your Journey <ArrowRight className="w-6 h-6" /></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] pt-16 pb-8 mt-20 relative z-10 bg-[#040508]/60 group-data-[scheme=light]:bg-[#f8fafc]/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-12 items-start">
          <div className="flex flex-col gap-4 text-left">
            <Link to="/" className="flex items-center gap-2.5 text-[var(--text-primary)] font-[var(--font-heading)] text-2xl font-extrabold tracking-tight no-underline mb-2">
              <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-xl overflow-hidden shadow-[0_4px_15px_var(--accent-glow),inset_0_2px_4px_rgba(255,255,255,0.3)]">
                <img src="/assets/images/LightModeLogo.png" className="w-full h-full object-contain z-10 hidden group-data-[scheme=light]:block" alt="Logo Light" />
                <img src="/assets/images/DarkModeLogo.png" className="w-full h-full object-contain z-10 block group-data-[scheme=light]:hidden" alt="Logo Dark" />
              </div>
              <span className="text-[var(--text-primary)]">
                Aura<span className="font-light bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-90">Tracker</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
              Premium routine & attendance assistant designed for high-achievers.
            </p>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Developed by <strong className="text-[var(--accent)] font-bold">ManTools'</strong>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-3.5">
              <h4 className="font-[var(--font-heading)] text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Product</h4>
              <a href="#features" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Features</a>
              <a href="#demo" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Theme Demo</a>
              <a href="#pricing" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-3.5">
              <h4 className="font-[var(--font-heading)] text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Security</h4>
              <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Privacy First</a>
              <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Local Database</a>
              <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Self-Hosted</a>
            </div>
            <div className="flex flex-col gap-3.5">
              <h4 className="font-[var(--font-heading)] text-[15px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">Developer</h4>
              <a href="https://github.com/MAnkan2006/AuraTacker" target="_blank" rel="noreferrer" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">GitHub Repo</a>
              <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Open Source</a>
              <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Documentation</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] h-px bg-[var(--card-border)] mx-auto mt-10 mb-6"></div>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center text-[13px] text-[var(--text-muted)]">
          <p>&copy; 2026 ManTools' Pvt. Ltd. All rights reserved. Crafted for visual excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
