import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const CustomerPortal = lazy(() => import('./pages/CustomerPortal').then(m => ({ default: m.CustomerPortal })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage').then(m => ({ default: m.RoleSelectionPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage').then(m => ({ default: m.TermsConditionsPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'CUSTOMER' | null>(null);

  const handleLogout = () => {
    setUser(null);
    setSelectedRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Sync user state with localStorage in case it changes elsewhere
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('user');
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-accent/30">
        <main>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Routes>
            {/* Landing Page */}
            <Route path="/" element={
              user ? (
                <Navigate to={user.role === 'ADMIN' ? '/admin' : '/customer-portal'} />
              ) : (
                <LandingPage />
              )
            } />

            {/* Role Selection */}
            <Route path="/role-selection" element={
              user ? (
                <Navigate to={user.role === 'ADMIN' ? '/admin' : '/customer-portal'} />
              ) : (
                <RoleSelectionPage onSelectRole={(role) => setSelectedRole(role)} />
              )
            } />

            {/* Login */}
            <Route path="/login" element={
              !user ? (
                <LoginPage role={selectedRole || undefined} />
              ) : (
                <Navigate to={user.role === 'ADMIN' ? '/admin' : '/customer-portal'} />
              )
            } />

            {/* Forgot Password */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Static Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />

            {/* Register */}
            <Route path="/register" element={<RegisterPage role={selectedRole || undefined} />} />
            
            {/* Dashboards */}
            <Route path="/customer-portal" element={
              user?.role === 'CUSTOMER' ? (
                <CustomerPortal user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } />
            
            <Route path="/admin" element={
              user?.role === 'ADMIN' ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
      </div>
    </Router>
  );
}
