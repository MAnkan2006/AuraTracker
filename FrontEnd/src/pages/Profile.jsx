import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useOutletContext } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import { AppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { getAvatarUrl, DEFAULT_AVATAR_PRESETS } from '../utils/avatar';
import { User, Mail, Settings, Target, CheckCircle2, Palette, Edit2, X, Save, TrendingUp, BarChart, Activity } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Dropdown from '../components/ui/Dropdown';

const Profile = () => {
  const { user, setUser, updateProfile, convertGuestAccount } = useContext(UserContext);
  const { appState } = useContext(AppContext);
  const { theme, setTheme, font, setFont } = useOutletContext();
  const { getStats } = useAttendance();
  const { addToast } = useToast();
  const stats = getStats();

  const avatarPresets = DEFAULT_AVATAR_PRESETS;

  const [selectedAvatar, setSelectedAvatar] = useState(getAvatarUrl(user?.avatar));
  const [targetGoal, setTargetGoal] = useState(user?.targetGoal || 75);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const formatDateForInput = (dStr) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return typeof dStr === 'string' ? dStr.split('T')[0] : '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [academicData, setAcademicData] = useState({
    university: user?.academicProfile?.university || '',
    program: user?.academicProfile?.program || '',
    semester: user?.academicProfile?.semester || '',
    section: user?.academicProfile?.section || '',
    termStartDate: formatDateForInput(user?.academicProfile?.termStartDate)
  });

  React.useEffect(() => {
    if (user?.academicProfile) {
      setAcademicData({
        university: user.academicProfile.university || '',
        program: user.academicProfile.program || '',
        semester: user.academicProfile.semester || '',
        section: user.academicProfile.section || '',
        termStartDate: formatDateForInput(user.academicProfile.termStartDate)
      });
    }
  }, [user]);
  
  const [convertData, setConvertData] = useState({ name: '', username: '', email: '', password: '' });
  const [convertError, setConvertError] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const glassPanelClass = "bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] group-data-[scheme=light]:border-black/[0.08] rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-data-[scheme=light]:shadow-sm transition-all duration-300";

  const handleSave = async () => {
    setIsSaving(true);
    const updates = { 
      avatar: selectedAvatar,
      targetGoal: parseInt(targetGoal),
      academicProfile: academicData 
    };
    const result = await updateProfile(updates);
    setIsSaving(false);
    
    if (result.success) {
      setIsEditing(false);
      setIsSuccessModalOpen(true);
    } else {
      addToast(result.message || 'Failed to save profile updates.', 'error');
    }
  };

  const handleCancel = () => {
    setSelectedAvatar(getAvatarUrl(user?.avatar));
    setTargetGoal(user?.targetGoal || 75);
    setAcademicData({
      university: user?.academicProfile?.university || '',
      program: user?.academicProfile?.program || '',
      semester: user?.academicProfile?.semester || '',
      section: user?.academicProfile?.section || '',
      termStartDate: formatDateForInput(user?.academicProfile?.termStartDate)
    });
    setIsEditing(false);
  };

  const handleGuestConvert = async (e) => {
    e.preventDefault();
    setConvertError('');
    if (!convertData.username || !convertData.email || !convertData.password) {
      setConvertError('Username, Email, and Password are required.');
      return;
    }
    setIsConverting(true);
    const result = await convertGuestAccount(
      { ...convertData, name: convertData.name || convertData.username, avatar: selectedAvatar },
      appState
    );
    setIsConverting(false);
    if (result.success) {
      setIsSuccessModalOpen(true);
    } else {
      setConvertError(result.message);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)]">User Profile</h2>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 mt-1">Manage your academic identity and settings.</p>
        </div>
        <div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-xl text-sm font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200 transition-colors shadow-sm"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 group-data-[scheme=light]:bg-gray-100 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-xl text-sm font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-200 transition-colors shadow-sm"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-xl text-sm font-bold text-white shadow-[0_4px_15px_var(--accent-glow)] hover:-translate-y-0.5 transition-all"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {user?.username?.toLowerCase() === 'guest' && (
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 group-data-[scheme=light]:bg-amber-50 group-data-[scheme=light]:border-amber-200 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-amber-500 mb-2">Convert Guest Account</h3>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 mb-6 text-sm">You are currently using a Guest account. Your data is only saved locally. Create a permanent account to sync your data across devices.</p>
          
          <form onSubmit={handleGuestConvert} className="space-y-4">
            {convertError && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl text-sm font-semibold">
                {convertError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Full Name (optional)" 
                className="w-full sm:col-span-2 px-4 py-3 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-gray-300 rounded-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 outline-none focus:border-[var(--accent)]"
                value={convertData.name}
                onChange={(e) => setConvertData({...convertData, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="New Username" 
                className="w-full px-4 py-3 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-gray-300 rounded-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 outline-none focus:border-[var(--accent)]"
                value={convertData.username}
                onChange={(e) => setConvertData({...convertData, username: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-3 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-gray-300 rounded-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 outline-none focus:border-[var(--accent)]"
                value={convertData.email}
                onChange={(e) => setConvertData({...convertData, email: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full sm:col-span-2 px-4 py-3 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-gray-300 rounded-xl text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 outline-none focus:border-[var(--accent)]"
                value={convertData.password}
                onChange={(e) => setConvertData({...convertData, password: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={isConverting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {isConverting ? 'Converting...' : 'Create Account & Migrate Data'}
            </button>
          </form>
        </div>
      )}

      <div className={`${glassPanelClass} flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden group`}>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] shadow-[0_8px_30px_var(--accent-glow)] shrink-0">
            <img 
              src={isEditing ? selectedAvatar : getAvatarUrl(user?.avatar)} 
              alt="Avatar" 
              className="w-full h-full rounded-full border-4 border-[var(--bg-base)] group-data-[scheme=light]:border-white object-cover"
            />
          </div>
          {isEditing && (
            <div className="bg-black/20 group-data-[scheme=light]:bg-gray-100 p-2 rounded-2xl w-full">
              <p className="text-xs text-center font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Choose Avatar</p>
              <div className="grid grid-cols-3 gap-2">
                {avatarPresets.map((preset, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedAvatar(preset)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${selectedAvatar === preset ? 'border-[var(--accent)] scale-110 shadow-[0_0_10px_var(--accent-glow)]' : 'border-transparent hover:border-white/20 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10 pt-2">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 font-[var(--font-heading)] mb-1">{user?.name || "Student User"}</h2>
          <p className="text-[var(--accent)] font-bold text-lg mb-4">@{user?.username || "student_1"}</p>
          <p className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-600 italic bg-white/5 group-data-[scheme=light]:bg-gray-50 px-4 py-3 rounded-xl border border-white/10 group-data-[scheme=light]:border-gray-200 inline-block shadow-inner">
            "{user?.bio || "Keep pushing, stay consistent!"}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={glassPanelClass}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 group-data-[scheme=light]:border-gray-200">
            <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
              <Settings size={20} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Account Settings</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="flex items-center gap-3 p-4 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl">
                <Mail size={18} className="text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400" />
                <span className="text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 font-medium">{user?.email || "No email provided"}</span>
              </div>
              {isEditing && <p className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500 mt-2 ml-1">Email address cannot be changed.</p>}
            </div>
            
            <div className="bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl p-5 shadow-inner group-data-[scheme=light]:shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 uppercase tracking-wider">Attendance Objective</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${stats.percentage >= targetGoal ? 'bg-emerald-500/20 text-emerald-400 group-data-[scheme=light]:text-emerald-700' : 'bg-red-500/20 text-red-400 group-data-[scheme=light]:text-red-700'}`}>
                  {stats.percentage >= targetGoal ? 'On Track' : 'Needs Attention'}
                </span>
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-black/20 group-data-[scheme=light]:bg-white rounded-xl p-3 border border-white/5 group-data-[scheme=light]:border-gray-200 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 group-data-[scheme=light]:text-blue-600 rounded-lg"><Activity size={18} /></div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">Actual Rate</div>
                    <div className="text-lg font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-none">{stats.percentage}%</div>
                  </div>
                </div>
                <div className="flex-1 bg-black/20 group-data-[scheme=light]:bg-white rounded-xl p-3 border border-white/5 group-data-[scheme=light]:border-gray-200 flex items-center gap-3">
                  <div className="p-2 bg-[var(--accent)]/20 text-[var(--accent)] rounded-lg"><Target size={18} /></div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">Target Goal</div>
                    <div className="text-lg font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 leading-none flex items-center gap-1">
                      {targetGoal}% {isEditing && <span className="text-[10px] text-[var(--accent)] animate-pulse">(Edit)</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-10 flex flex-col justify-center mb-1">
                {/* Background Track */}
                <div className="absolute w-full h-3 bg-black/30 group-data-[scheme=light]:bg-gray-200 rounded-full overflow-hidden">
                  {/* Actual Fill */}
                  <div 
                    className={`h-full transition-all duration-1000 ${stats.percentage >= targetGoal ? 'bg-emerald-500 group-data-[scheme=light]:bg-emerald-400' : 'bg-red-500 group-data-[scheme=light]:bg-red-400'}`}
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                
                {/* Target Marker Line (Always visible) */}
                <div 
                  className="absolute h-5 w-1 bg-white group-data-[scheme=light]:bg-gray-800 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] z-10 pointer-events-none transition-all duration-100"
                  style={{ left: `calc(${targetGoal}% - 2px)`, top: '50%', transform: 'translateY(-50%)' }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-black/50 group-data-[scheme=light]:bg-gray-200 px-1 rounded text-white group-data-[scheme=light]:text-gray-700 whitespace-nowrap">Target</div>
                </div>

                {/* The Slider Overlay (Only interactive in edit mode, invisible thumb) */}
                {isEditing && (
                  <input 
                    type="range" 
                    min="0"
                    max="100"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    title="Slide to change target goal"
                  />
                )}
              </div>
              
              <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] group-data-[scheme=light]:text-gray-400 px-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        <div className={glassPanelClass}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 group-data-[scheme=light]:border-gray-200">
            <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
              <User size={20} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Academic Profile</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'University', key: 'university', type: 'text' },
              { label: 'Program', key: 'program', type: 'text' },
              { label: 'Semester', key: 'semester', type: 'text' },
              { label: 'Section', key: 'section', type: 'text' },
              { label: 'Session Start Date', key: 'termStartDate', type: 'date' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center py-3 px-3 border-b border-white/5 group-data-[scheme=light]:border-gray-100 last:border-0 hover:bg-white/5 group-data-[scheme=light]:hover:bg-gray-50 rounded-lg transition-colors min-h-[56px]">
                <span className="font-semibold text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 text-sm mb-1 sm:mb-0 w-1/3">{item.label}</span>
                <div className="w-full sm:w-2/3 flex justify-end">
                  {isEditing ? (
                    <input 
                      type={item.type || "text"} 
                      className="w-full sm:w-[90%] px-3 py-1.5 bg-white/5 group-data-[scheme=light]:bg-white border border-white/10 group-data-[scheme=light]:border-gray-300 text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 rounded-lg outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] font-bold text-sm shadow-inner group-data-[scheme=light]:shadow-sm transition-all"
                      value={academicData[item.key] || ''}
                      onChange={(e) => setAcademicData({...academicData, [item.key]: e.target.value})}
                      placeholder={`Enter ${item.label}`}
                    />
                  ) : (
                    <span className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 text-sm sm:text-right">
                      {item.key === 'termStartDate' 
                        ? (academicData[item.key] || (user?.academicProfile?.termStartDate ? formatDateForInput(user.academicProfile.termStartDate) : "Not set"))
                        : (user?.academicProfile?.[item.key] || "Not set")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Preferences Block */}
        <div className={`${glassPanelClass} md:col-span-2`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 group-data-[scheme=light]:border-gray-200">
            <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
              <Settings size={20} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900">Notification Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl flex items-center justify-between hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-100 transition-colors">
              <div>
                <h4 className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1">Email Reports</h4>
                <p className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">Receive weekly attendance summaries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-black/30 group-data-[scheme=light]:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>
            
            <div className="p-5 bg-white/5 group-data-[scheme=light]:bg-gray-50 border border-white/10 group-data-[scheme=light]:border-gray-200 rounded-2xl flex items-center justify-between hover:bg-white/10 group-data-[scheme=light]:hover:bg-gray-100 transition-colors">
              <div>
                <h4 className="font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 mb-1">Smart Alerts</h4>
                <p className="text-xs text-[var(--text-muted)] group-data-[scheme=light]:text-gray-500">Warn me before dropping below target</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-black/30 group-data-[scheme=light]:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} title="Success!">
        <div className="flex flex-col items-center text-center py-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-lg text-[var(--text-primary)] group-data-[scheme=light]:text-gray-800 font-medium">
            Your profile settings have been successfully updated.
          </p>
          <div className="p-4 bg-white/5 group-data-[scheme=light]:bg-green-50 border border-white/10 group-data-[scheme=light]:border-green-200 rounded-xl mt-6 w-full text-center">
            <span className="text-[var(--text-secondary)] group-data-[scheme=light]:text-gray-500 text-sm font-semibold">New Target Goal:</span>
            <span className="ml-2 font-bold text-[var(--text-primary)] group-data-[scheme=light]:text-gray-900 text-lg">{targetGoal}%</span>
          </div>
          <button 
            onClick={() => setIsSuccessModalOpen(false)}
            className="w-full mt-6 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white font-bold rounded-2xl hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_var(--accent-glow)]"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
