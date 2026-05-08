import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#050608]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between relative">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        
        <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent italic relative group",
                  isActive ? "text-accent" : "text-slate-400"
                )
              }
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full group-[.active]:w-full" />
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link to="/role-selection" className="hidden sm:flex btn-primary py-2 px-6 text-xs whitespace-nowrap">
            Get Started
          </Link>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-accent transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/5 bg-[#050608]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    cn(
                      "text-sm font-black uppercase tracking-[0.3em] transition-all italic",
                      isActive ? "text-accent translate-x-2" : "text-slate-400 hover:text-white"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link 
                to="/role-selection" 
                onClick={() => setIsOpen(false)}
                className="btn-primary py-4 text-center mt-4"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
