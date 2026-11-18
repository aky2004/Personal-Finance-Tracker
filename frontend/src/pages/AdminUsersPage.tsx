import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { User, UserRole } from '../types';
import { Shield, Users, Mail, CheckCircle } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setMessage(`Updated account role to ${newRole}`);
      setTimeout(() => setMessage(null), 3000);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update user role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-ink-light dark:text-ink-dark tracking-tight flex items-center gap-2">
            <Shield className="text-brand dark:text-brand-dark" size={22} /> User Administration
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-darkmuted mt-0.5">
            Admin console for account oversight and RBAC security role management
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-money-green dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-money-greendark rounded-xl text-xs flex items-center gap-2">
          <CheckCircle size={15} />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-panel-light dark:bg-panel-dark border border-borderline-light dark:border-borderline-dark rounded-2xl overflow-hidden shadow-moneymatter dark:shadow-moneymatter-dark">
        <div className="px-5 py-3.5 border-b border-borderline-light dark:border-borderline-dark flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-ink-light dark:text-ink-dark">
            <Users size={16} className="text-brand dark:text-brand-dark" />
            <span>Registered Accounts ({users.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-soft-light dark:bg-soft-dark text-ink-muted dark:text-ink-darkmuted uppercase tracking-wider font-bold border-b border-borderline-light dark:border-borderline-dark">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role (RBAC)</th>
                <th className="py-3 px-4 text-center">Transactions</th>
                <th className="py-3 px-4 text-right">Inflow / Outflow</th>
                <th className="py-3 px-4 text-center">Modify Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline-light/60 dark:divide-borderline-dark/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ink-muted">
                    Loading accounts...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-soft-light/60 dark:hover:bg-soft-dark/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-ink-light dark:text-ink-dark">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 text-ink-muted dark:text-ink-darkmuted font-mono">
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} /> {u.email}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300'
                            : u.role === 'read-only'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">
                      {u.transaction_count || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      <span className="text-money-green dark:text-money-greendark block">
                        +${Number(u.total_income || 0).toFixed(2)}
                      </span>
                      <span className="text-money-red dark:text-money-reddark block">
                        -${Number(u.total_expense || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 text-xs bg-soft-light dark:bg-soft-dark text-ink-light dark:text-ink-dark border border-borderline-light dark:border-borderline-dark rounded-lg font-medium focus:ring-1 focus:ring-brand"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="read-only">read-only</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
