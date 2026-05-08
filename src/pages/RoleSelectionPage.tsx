import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Footer } from '../components/Footer';

interface RoleSelectionPageProps {
  onSelectRole: (role: 'ADMIN' | 'CUSTOMER') => void;
}

export const RoleSelectionPage = ({ onSelectRole }: RoleSelectionPageProps) => {
  const navigate = useNavigate();

  const handleAction = (role: 'ADMIN' | 'CUSTOMER', action: 'login' | 'register') => {
    onSelectRole(role);
    navigate(`/${action}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center space-x-3 text-slate-500 hover:text-white transition-colors group z-50"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] italic">Back to Home</span>
      </motion.button>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 md:mb-16 relative z-10 pt-16 md:pt-0"
      >
        <Logo size="md" className="flex-col space-x-0 space-y-4 md:space-y-6 mb-6 md:mb-8" />
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight italic uppercase">
          Welcome to <span className="text-accent text-glow-accent">Carlofy</span>
        </h1>
        <p className="text-slate-500 mt-4 text-sm md:text-base font-medium tracking-wide">Select your access portal to continue</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {/* Administrator Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-accent/20 rounded-[24px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative glass-card p-6 md:p-10 flex flex-col items-center text-center h-full glass-card-hover group-hover:border-accent/40">

            <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/5 group-hover:bg-accent/20 transition-colors">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Administrator</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Securely manage the platform: edit customer details, track and filter service requests, and update operation status in real-time.
            </p>
            
            <div className="mt-auto w-full space-y-3">
              <button 
                onClick={() => handleAction('ADMIN', 'login')}
                className="w-full py-4 bg-accent text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </motion.div>

        {/* Customer Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative"
        >
          <div className="absolute -inset-0.5 bg-accent/20 rounded-[24px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative glass-card p-6 md:p-10 flex flex-col items-center text-center h-full glass-card-hover group-hover:border-accent/40">

            <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/5 group-hover:bg-accent/20 transition-colors">
              <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">Customer</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Manage your vehicle profile, book high-performance services, and track your history.
            </p>
            
            <div className="mt-auto w-full space-y-3">
              <button 
                onClick={() => handleAction('CUSTOMER', 'login')}
                className="w-full py-4 bg-accent text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleAction('CUSTOMER', 'register')}
                className="w-full py-4 bg-white/5 text-white/70 border border-white/10 font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 hover:text-white transition-all"
              >
                Register Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="w-full mt-20">
        <Footer />
      </div>
    </div>
  );
};

