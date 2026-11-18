import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  BookOpen,
  Shield,
  ShieldAlert,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Wallet,
  User as UserIcon,
  Eye,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout, isAdmin, isReadOnly } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-brand/10 text-brand dark:bg-brand-dark/15 dark:text-brand-dark font-bold shadow-xs'
        : 'text-ink-muted dark:text-ink-darkmuted hover:bg-soft-light dark:hover:bg-soft-dark hover:text-ink-light dark:hover:text-ink-dark'
    }`;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col justify-between bg-panel-light dark:bg-panel-dark border-r border-borderline-light dark:border-borderline-dark p-4 shrink-0 transition-colors">
      {/* 1. Brand Logo Header */}
      <div className="space-y-6">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-1 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-violet-600 dark:from-brand-dark dark:to-purple-500 flex items-center justify-center text-white shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
            <Wallet size={19} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-ink-light dark:text-ink-dark">
              Money<span className="text-brand dark:text-brand-dark">Matter</span>
            </span>
            <span className="text-[10px] text-ink-muted dark:text-ink-darkmuted -mt-1 font-mono">
              Finance Tracker
            </span>
          </div>
        </Link>

        {/* Read-Only Status Notice */}
        {isReadOnly && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400" />
              <span>Read-Only Mode</span>
            </div>
            <p className="leading-tight opacity-90 text-[10px]">
              Viewing transactions and analytics without mutation privileges.
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/transactions" className={navClass}>
            <CreditCard size={17} />
            <span>Transactions</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin/users" className={navClass}>
              <Users size={17} />
              <span>User Management</span>
            </NavLink>
          )}

          <a
            href="http://localhost:5001/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-ink-muted dark:text-ink-darkmuted hover:bg-soft-light dark:hover:bg-soft-dark hover:text-ink-light dark:hover:text-ink-dark transition-all"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={17} />
              <span>Swagger API</span>
            </div>
            <ExternalLink size={12} className="opacity-60" />
          </a>
        </nav>
      </div>

      {/* 2. Bottom User Profile & Controls (MoneyMatter Style) */}
      <div className="border-t border-borderline-light dark:border-borderline-dark pt-3 space-y-2">
        {/* User Card */}
        {user && (
          <div className="p-2.5 rounded-xl bg-soft-light dark:bg-soft-dark flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand/15 dark:bg-brand-dark/20 text-brand dark:text-brand-dark flex items-center justify-center font-bold text-xs shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-light dark:text-ink-dark truncate">
                  {user.name}
                </p>
                <span
                  className={`inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : isReadOnly
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isAdmin ? <Shield size={9} /> : isReadOnly ? <Eye size={9} /> : <UserIcon size={9} />}
                  {user.role}
                </span>
              </div>
            </div>

            {/* Quick Actions: Theme Toggle & Logout */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-1.5 rounded-lg text-ink-muted dark:text-ink-darkmuted hover:bg-panel-light dark:hover:bg-panel-dark transition-colors"
              >
                {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} />}
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-money-red dark:text-money-reddark hover:bg-panel-light dark:hover:bg-panel-dark transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
