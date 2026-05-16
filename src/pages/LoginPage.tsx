import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { api } from '../lib/api';

interface LoginPageProps {
  role?: 'ADMIN' | 'CUSTOMER';
}

export const LoginPage = ({ role }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/customer-portal';
      }
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else if (typeof err.response.data === 'string') {
        setError(err.response.data);
      } else if (err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/role-selection')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center space-x-3 text-slate-500 hover:text-white transition-colors group z-50"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] italic">Back to Selection</span>
      </motion.button>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] glass-card p-10 md:p-14 relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
            <Logo size="lg" className="flex-col space-x-0 space-y-4" />
          </Link>
          
          <p className="text-slate-400 mt-2 font-medium tracking-tight">Login to your account to continue</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-3 bg-red-500/5 border-l-2 border-red-500/50 rounded-r-lg text-red-400 text-[11px] font-bold tracking-wide"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
          {/* Hidden bait fields to trap browser autofill */}
          <input type="text" name="prevent_autofill_user" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="password" name="prevent_autofill_pass" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
            <input 
              type="email" 
              id="user_identity_login"
              name="user_identity_login"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="input-field"
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
              {role !== 'ADMIN' && (
                <Link to="/forgot-password" className="text-[10px] font-bold text-accent hover:underline uppercase tracking-wide">Forgot Password?</Link>
              )}
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="user_secure_access"
                name="user_secure_access"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="input-field pr-12"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

          <div className="mt-12 text-center space-y-6">
            {role !== 'ADMIN' && (
              <p className="text-slate-500 font-bold text-sm">
                Don't have an account? <Link to="/register" className="text-accent hover:underline ml-1">Register here</Link>
              </p>
            )}
            {role !== 'ADMIN' && (
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Need Help?</p>
                <p className="text-sm font-black text-white italic tracking-tighter">Support: +91 90198 54584</p>
              </div>
            )}
          </div>
      </motion.div>
      <div className="w-full mt-20">
        <Footer />
      </div>
    </div>
  );
};
