import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, timeLeft]);

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setStep('verify');
      setTimeLeft(100);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data || 'Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    setOtp('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setTimeLeft(100);
      alert('A new verification code has been sent to your email.');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/reset-password', { email, otp, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to reset password. Session might have expired.');
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
        onClick={() => navigate('/login')}
        className="absolute top-8 left-8 flex items-center space-x-3 text-slate-500 hover:text-white transition-colors group z-50"
      >
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Back to Login</span>
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
          
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
            {success ? 'Success' : step === 'request' ? 'Forgot Password' : step === 'verify' ? 'Verify OTP' : 'New Password'}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {success 
              ? 'Your password has been reset successfully.' 
              : step === 'request' 
                ? 'Enter your email to receive a verification code' 
                : step === 'verify' 
                  ? `Enter the 6-digit code sent to ${email}` 
                  : 'Enter your new secure password'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center italic">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm font-bold italic">
              Password has been updated! You can now log in with your new password.
            </div>
            <button onClick={() => navigate('/login')} className="btn-primary w-full shadow-[0_0_20px_rgba(187,247,208,0.3)]">
              Proceed to Sign In
            </button>
          </div>
        ) : step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : step === 'verify' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verification Code (OTP)</label>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input-field text-center text-2xl tracking-[0.5em] font-black"
                  placeholder="000000"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    timeLeft > 0 ? "bg-accent shadow-[0_0_10px_rgba(217,255,63,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  )} />
                  <span className={cn(
                    "text-xs font-black italic tracking-widest",
                    timeLeft > 0 ? "text-white" : "text-red-500"
                  )}>
                    {timeLeft > 0 
                      ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} REMAINING`
                      : 'EXPIRED'}
                  </span>
                </div>
                
                <button 
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || (timeLeft > 0)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] italic transition-all",
                    timeLeft > 0 
                      ? "text-slate-600 cursor-not-allowed" 
                      : "text-accent hover:text-white cursor-pointer hover:tracking-[0.3em]"
                  )}
                >
                  {timeLeft > 0 ? `Resend code in ${timeLeft}s` : 'Resend Verification Code'}
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button 
                type="submit" 
                className="btn-primary w-full" 
                disabled={loading || timeLeft === 0}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('request')} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors text-center italic"
              >
                Change Email
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    disabled={loading}
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
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full shadow-[0_0_20px_rgba(187,247,208,0.3)]" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </motion.div>
      <div className="w-full mt-20">
        <Footer />
      </div>
    </div>
  );
};
