import { ArrowLeft } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { api } from '../lib/api';

interface RegisterPageProps {
  role?: 'ADMIN' | 'CUSTOMER';
}

export const RegisterPage = ({ role = 'CUSTOMER' }: RegisterPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: role
      });

      alert(`Account created successfully! Please sign in.`);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to register account');
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
        className="w-full max-w-[600px] glass-card p-10 md:p-14 relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
            <Logo size="lg" className="flex-col space-x-0 space-y-4" />
          </Link>
          
          {role === 'ADMIN' && (
            <div className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-6">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Admin Access Only</span>
            </div>
          )}
          
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
            {role === 'ADMIN' ? 'Create Admin account' : 'Customer registration'}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Join the Carlofy performance network</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center italic">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Full Name</label>
              <input 
                required
                className="input-field" 
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Phone Number</label>
              <input 
                required
                className="input-field" 
                placeholder="+91 99999 00000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
            <input 
              required
              type="email"
              className="input-field" 
              placeholder="you@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
              <input 
                required
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Confirm Password</label>
              <input 
                required
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : `Create ${role === 'ADMIN' ? 'Admin' : 'Customer'} Account`}
          </button>
        </form>

        <div className="mt-12 text-center space-y-6">
          <p className="text-slate-500 font-bold text-sm">
            Already have an account? <Link to="/login" className="text-accent hover:underline ml-1">Sign in</Link>
          </p>
          <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Need Help?</p>
            <p className="text-sm font-black text-white italic tracking-tighter">Support: +91 91500 52277</p>
          </div>
        </div>
      </motion.div>
      <div className="w-full mt-20">
        <Footer />
      </div>
    </div>
  );
};
