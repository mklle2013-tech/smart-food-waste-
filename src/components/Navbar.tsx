import React from 'react';
import {
  Sprout,
  LogIn,
  LogOut,
  ShieldCheck,
  Cpu,
  Flame,
  Leaf,
  Layers,
  Archive,
  BarChart3,
  Wifi,
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  isLoggingIn: boolean;
  onOpenWasteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onSignIn,
  onSignOut,
  isLoggingIn,
  onOpenWasteModal,
}) => {
  const isAdmin = currentUser?.email === '68113833@dpu.ac.th';

  const navItems = [
    { id: 'dashboard', label: 'ภาพรวม & ผลกระทบ', icon: BarChart3 },
    { id: 'wasteLogs', label: 'บันทึกเศษอาหาร', icon: Leaf },
    { id: 'compostBins', label: 'ถังหมัก & เซนเซอร์ IoT', icon: Cpu },
    { id: 'batches', label: 'รอบการแปรรูปปุ๋ย', icon: Flame },
    { id: 'fertilizer', label: 'คลังผลผลิตปุ๋ย', icon: Archive },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-emerald-900/30 text-white">
      {/* Top Banner with Project Name & Firebase status */}
      <div className="bg-emerald-950/60 border-b border-emerald-800/30 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 text-emerald-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-300">Firebase Project:</span>
          <code className="bg-emerald-900/40 px-1.5 py-0.5 rounded text-emerald-100 font-mono">
            smart food waste-to-fertilizer system
          </code>
          <span className="hidden sm:inline text-emerald-400/60">• Firestore Online</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-300/80">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>IoT Telemetry Synchronized</span>
          </div>
          {currentUser && (
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-medium border border-emerald-500/30">
              {isAdmin ? '👑 ผู้ดูแลระบบ (Admin)' : 'เจ้าหน้าที่ปฏิบัติการ'}
            </span>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/50 border border-emerald-400/40">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                Smart Food Waste-to-Fertilizer
              </h1>
            </div>
            <p className="text-xs text-emerald-400/90 mt-0.5 font-light">
              ระบบแปลงขยะเศษอาหารเป็นปุ๋ยชีวภาพอัจฉริยะ
            </p>
          </div>
        </div>

        {/* Action button & User Profile / Login */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWasteModal}
            className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-all shadow-md shadow-emerald-900/40 active:scale-95 border border-emerald-400/30"
          >
            <Leaf className="w-4 h-4 text-emerald-200" />
            <span>+ บันทึกเศษอาหาร</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
              <div className="relative">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-semibold flex items-center justify-center text-xs">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950"></span>
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[140px]">
                  {currentUser.displayName || 'ผู้ใช้งาน'}
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={onSignOut}
                title="ออกจากระบบ"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={isLoggingIn}
              className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 border border-slate-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoggingIn ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบด้วย Gmail'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
