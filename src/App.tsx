import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerPortal } from './pages/CustomerPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import { RoleSelectionPage } from './pages/RoleSelectionPage';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

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
        </main>
      </div>
    </Router>
  );
}
