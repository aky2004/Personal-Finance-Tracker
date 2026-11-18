import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  LogOut,
  Shield,
  User as UserIcon,
  Eye,
  Database,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isReadOnly, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Determine active section name for MoneyMatter breadcrumb header
  const getSectionTitle = () => {
    if (location.pathname.startsWith('/transactions')) return 'Transactions Ledger';
    if (location.pathname.startsWith('/admin/users')) return 'User Administration';
    if (location.pathname.startsWith('/docs')) return 'Technical Documentation';
    if (location.pathname.startsWith('/contact')) return 'Help & Support';
    return 'Dashboard & Cash Flow';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0b0908]/90 backdrop-blur-md border-b border-[#24211d] px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Logo & Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile brand indicator */}
        <Link to="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7355be] to-[#9376de] text-white flex items-center justify-center font-black text-xs shadow-md shadow-[#7355be]/30">
            M
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            Money<span className="text-[#9376de]">Matter</span>
          </span>
        </Link>

        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#8c857b]">
          <span>App</span>
          <span>/</span>
          <span className="text-white font-bold">
            {getSectionTitle()}
          </span>
        </div>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-3">
        {/* Live System Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#141210] border border-[#24211d] text-[11px] font-mono text-[#8c857b]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a] animate-pulse" />
          <span className="text-white">PostgreSQL ACID</span>
          <span>•</span>
          <span className="text-[#9376de]">Redis Active</span>
        </div>

        {/* Role Pill */}
        {user && (
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isAdmin
                ? 'bg-purple-950/40 text-purple-300 border-purple-800/60'
                : isReadOnly
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                : 'bg-emerald-950/40 text-[#4cc38a] border-emerald-800/60'
            }`}
          >
            {isAdmin ? <Shield size={11} /> : isReadOnly ? <Eye size={11} /> : <UserIcon size={11} />}
            <span>{user.role}</span>
          </span>
        )}

        {/* Theme Toggle (Mobile) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="md:hidden p-2 rounded-xl text-[#8c857b] hover:text-white hover:bg-[#1a1714] transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
        </button>

        {/* Logout (Mobile) */}
        <button
          onClick={logout}
          aria-label="Logout"
          className="md:hidden p-2 rounded-xl text-[#ef6a57] hover:bg-[#1a1714] transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
