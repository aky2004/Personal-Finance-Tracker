import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Users, BookOpen, ShieldAlert } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { isAdmin, isReadOnly } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
    }`;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 space-y-6">
        {/* Read-only notification banner */}
        {isReadOnly && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert size={15} /> Read-Only Account
            </div>
            <p className="text-[11px] leading-relaxed">
              You can explore analytics and transactions, but add/edit/delete actions are restricted.
            </p>
          </div>
        )}

        <nav className="space-y-1">
          <NavLink to="/" end className={navClass}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={navClass}>
            <Receipt size={18} />
            <span>Transactions</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin/users" className={navClass}>
              <Users size={18} />
              <span>User Management</span>
            </NavLink>
          )}
          <a
            href="http://localhost:5001/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} />
              <span>Swagger API Docs</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              OpenAPI
            </span>
          </a>
        </nav>
      </div>
    </aside>
  );
};
