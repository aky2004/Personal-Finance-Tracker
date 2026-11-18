import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Wallet,
  Sun,
  Moon,
  LogOut,
  Zap,
  Shield,
  User as UserIcon,
  Eye,
  Plus,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isReadOnly, isAdmin, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Determine active section name for MoneyMatter breadcrumb header
  const getSectionTitle = () => {
    if (location.pathname.startsWith('/transactions')) return 'Transactions';
    if (location.pathname.startsWith('/admin/users')) return 'User Management';
    return 'Dashboard & Cash Flow';
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-panel-light/85 dark:bg-panel-dark/85 backdrop-blur-md border-b border-borderline-light dark:border-borderline-dark px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Logo & Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile brand indicator */}
        <Link to="/dashboard" className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold">
            <Wallet size={16} />
          </div>
          <span className="font-bold text-sm tracking-tight text-ink-light dark:text-ink-dark">
            Money<span className="text-brand dark:text-brand-dark">Matter</span>
          </span>
        </Link>

        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-ink-muted dark:text-ink-darkmuted">
          <span>Overview</span>
          <span>/</span>
          <span className="text-ink-light dark:text-ink-dark font-bold">
            {getSectionTitle()}
          </span>
        </div>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-3">
        {/* Role Pill */}
        {user && (
          <span
            className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isAdmin
                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                : isReadOnly
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
            }`}
          >
            {isAdmin ? <Shield size={10} /> : isReadOnly ? <Eye size={10} /> : <UserIcon size={10} />}
            <span>{user.role}</span>
          </span>
        )}

        {/* Theme Toggle (Mobile) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="md:hidden p-1.5 rounded-lg text-ink-muted dark:text-ink-darkmuted hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
        </button>

        {/* Logout (Mobile) */}
        <button
          onClick={logout}
          aria-label="Logout"
          className="md:hidden p-1.5 rounded-lg text-money-red dark:text-money-reddark hover:bg-soft-light dark:hover:bg-soft-dark transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
