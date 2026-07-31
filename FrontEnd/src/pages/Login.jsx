import React, { useContext, useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Eye, EyeOff, Moon, Sun, ArrowLeft } from 'lucide-react';

const Login = ({ defaultIsLogin = true }) => {
  const { isAuthenticated, login } = useContext(UserContext);
  const [isLoginView, setIsLoginView] = useState(defaultIsLogin);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('aura_isLightMode') === 'true';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // OAuth Token Handling from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const urlError = params.get('error');

    if (token) {
      login(token);
      navigate('/app', { replace: true });
    } else if (urlError) {
      setError(urlError.replace(/_/g, ' '));
    }
  }, [location.search, login, navigate]);

  useEffect(() => {
    localStorage.setItem('aura_isLightMode', isLightMode);
    
    // Update Favicon based on theme
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = isLightMode ? "/assets/images/LightModeLogo.png" : "/assets/images/DarkModeLogo.png";
    }
  }, [isLightMode]);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('Manual login is pending backend integration. Please use OAuth.');
  };

  return (
    <div 
      className="group relative min-h-screen bg-[#0a0f1c] data-[scheme=light]:bg-[#f8fafc] flex items-center justify-center p-4 overflow-x-hidden transition-colors duration-500" 
      data-theme="classic-obsidian" 
      data-scheme={isLightMode ? 'light' : 'dark'} 
      data-font="font-modern"
    >
      {/* Top Navigation */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <Link to="/" className="flex items-center gap-2 text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <button 
          onClick={() => setIsLightMode(!isLightMode)} 
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-black/[0.08] text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 hover:text-[var(--text-primary)] group-data-[scheme=light]:hover:text-gray-900 transition-all backdrop-blur-sm group-data-[scheme=light]:shadow-sm"
        >
          {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Background Blobs matching legacy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[var(--accent)] rounded-full mix-blend-screen group-data-[scheme=light]:mix-blend-multiply filter blur-[120px] opacity-20"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen group-data-[scheme=light]:mix-blend-multiply filter blur-[120px] opacity-20 group-data-[scheme=light]:opacity-15"></div>
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-[420px] bg-[#141621B3] group-data-[scheme=light]:bg-white/90 backdrop-blur-xl border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(99,102,241,0.15)] group-data-[scheme=light]:shadow-[0_20px_60px_rgba(0,0,0,0.05),0_0_40px_rgba(99,102,241,0.05)] flex flex-col gap-6 z-10 transition-colors duration-500">
        
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-3 no-underline">
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-xl shadow-[0_4px_15px_var(--accent-glow),inset_0_2px_4px_rgba(255,255,255,0.3)] overflow-hidden">
               <img src={isLightMode ? "/assets/images/LightModeLogo.png" : "/assets/images/DarkModeLogo.png"} className="w-full h-full object-contain z-10" alt="AuraTracker Logo" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">
                Aura<span className="font-light bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-100">Tracker</span>
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Premium Attendance & Routine Manager by ManTools'</p>
            </div>
          </Link>
        </div>

        {/* Toggle */}
        <div className="relative flex bg-white/5 group-data-[scheme=light]:bg-gray-100/80 border border-white/10 group-data-[scheme=light]:border-black/[0.04] rounded-xl p-1 transition-colors">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg shadow-[0_4px_14px_var(--accent-glow)] transition-transform duration-300 ease-out ${isLoginView ? 'translate-x-0' : 'translate-x-full'}`}
          ></div>
          <button 
            type="button"
            onClick={() => { setIsLoginView(true); setError(''); }} 
            className={`relative flex-1 py-2 text-sm font-semibold transition-colors duration-300 z-10 ${isLoginView ? 'text-white drop-shadow-md' : 'text-gray-400 hover:text-white group-data-[scheme=light]:text-gray-500 group-data-[scheme=light]:hover:text-gray-900'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => { setIsLoginView(false); setError(''); }} 
            className={`relative flex-1 py-2 text-sm font-semibold transition-colors duration-300 z-10 ${!isLoginView ? 'text-white drop-shadow-md' : 'text-gray-400 hover:text-white group-data-[scheme=light]:text-gray-500 group-data-[scheme=light]:hover:text-gray-900'}`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Enter your username" 
              required 
              className="bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-xl px-4 py-3 text-white group-data-[scheme=light]:text-gray-900 placeholder-gray-500 group-data-[scheme=light]:placeholder-gray-400 focus:outline-none focus:border-[var(--accent)] group-data-[scheme=light]:focus:border-[var(--accent)] focus:bg-white/10 group-data-[scheme=light]:focus:bg-white transition-all shadow-inner group-data-[scheme=light]:shadow-sm" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                className="w-full bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-xl px-4 py-3 text-white group-data-[scheme=light]:text-gray-900 placeholder-gray-500 group-data-[scheme=light]:placeholder-gray-400 focus:outline-none focus:border-[var(--accent)] group-data-[scheme=light]:focus:border-[var(--accent)] focus:bg-white/10 group-data-[scheme=light]:focus:bg-white transition-all shadow-inner group-data-[scheme=light]:shadow-sm" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 hover:text-white group-data-[scheme=light]:hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 group-data-[scheme=light]:text-red-600 text-sm bg-red-400/10 group-data-[scheme=light]:bg-red-500/10 border border-red-400/20 group-data-[scheme=light]:border-red-500/20 px-3 py-2 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_var(--accent-glow)] group-data-[scheme=light]:shadow-[0_8px_25px_var(--accent-glow)] hover:shadow-[0_6px_25px_var(--accent-glow)] group-data-[scheme=light]:hover:shadow-[0_12px_30px_var(--accent-glow)] hover:-translate-y-0.5 transition-all mt-2"
          >
            {isLoginView ? 'Login to Dashboard' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-white/10 group-data-[scheme=light]:before:bg-black/[0.08] after:h-px after:flex-1 after:bg-white/10 group-data-[scheme=light]:after:bg-black/[0.08]">
          <span className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 uppercase tracking-wider font-bold">Or continue with</span>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            type="button"
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-xl font-semibold text-white group-data-[scheme=light]:text-gray-900 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 group-data-[scheme=light]:shadow-sm transition-all"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
             Google
          </button>
          <button 
            type="button"
            onClick={handleGithubLogin} 
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-black/[0.08] rounded-xl font-semibold text-white group-data-[scheme=light]:text-gray-900 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-50 group-data-[scheme=light]:shadow-sm transition-all"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white group-data-[scheme=light]:fill-gray-900" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
             GitHub
          </button>
        </div>

        <button 
          type="button"
          onClick={() => login('dev-mock-token')} 
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-black/[0.04] rounded-xl font-bold text-gray-300 group-data-[scheme=light]:text-gray-600 hover:text-white group-data-[scheme=light]:hover:text-gray-900 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200 transition-all"
        >
          Explore as Guest
        </button>
      </div>
    </div>
  );
};

export default Login;
