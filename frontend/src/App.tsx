import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Route-based code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

const PageFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-3 border-brand dark:border-brand-dark border-t-transparent rounded-full animate-spin"></div>
    <p className="text-xs font-semibold text-ink-muted dark:text-ink-darkmuted">Loading MoneyMatter...</p>
  </div>
);

// MoneyMatter Full Height Docked Shell Layout
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-light dark:bg-surface-dark text-ink-light dark:text-ink-dark transition-colors duration-200">
      {/* Docked Left Sidebar */}
      <Sidebar />

      {/* Main Scrollable Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected App Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/dashboard"
                  element={
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <AppLayout>
                      <TransactionsPage />
                    </AppLayout>
                  }
                />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route
                  path="/admin/users"
                  element={
                    <AppLayout>
                      <AdminUsersPage />
                    </AppLayout>
                  }
                />
              </Route>

              {/* Catch-all fallback to Landing Page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
