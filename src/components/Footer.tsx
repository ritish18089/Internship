import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, ArrowUp, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface FooterProps {
  showBanner?: boolean;
}

export const Footer = ({ showBanner = true }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-12 px-6 border-t border-white/5 bg-[#050608]/80 backdrop-blur-md overflow-hidden">
      {/* Background patterns similar to image */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Visual Pre-footer Banner */}
        {showBanner && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[40px] overflow-hidden mb-24 group border border-white/5">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1400')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/20 backdrop-blur-md border border-accent/30 rounded-full">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Unlimited Performance</span>
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-tight max-w-3xl">
                  Ready to experience <br />
                  <span className="text-accent text-glow">The Next Level?</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                  <Link to="/login" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-white transition-colors italic border-b border-white/10 pb-1">
                    Established Member Login
                  </Link>
                  <Link to="/role-selection" className="group relative px-10 md:px-12 py-5 md:py-6 bg-accent text-black font-black uppercase italic text-xs tracking-widest rounded-xl overflow-hidden active:scale-95 transition-all shadow-[0_0_50px_rgba(217,255,63,0.3)] w-full sm:w-auto">
                    <span className="relative z-10 flex items-center justify-center">
                      Start Your Engines <ArrowUp className="ml-3 w-4 h-4 rotate-45" />
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Column 1: Branding & Contact */}
          <div className="space-y-8">
            <Logo size="md" />
            <div className="space-y-4">
              <a href="https://wa.me/message/VO7NPNOOEGEWD1" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group">
                <span className="text-sm font-medium">WhatsApp: 9019854584</span>
              </a>
              <a href="mailto:ritish1808@gmail.com" className="flex items-center space-x-3 text-slate-400 hover:text-accent transition-colors group">
                <span className="text-sm font-medium">Email: ritish1808@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Services (Mocking 'Courses' from image) */}
          <div className="space-y-8">
            <h4 className="text-accent font-black uppercase italic tracking-widest text-sm underline decoration-accent/20 underline-offset-8">Services</h4>
            <div className="flex flex-col space-y-4">
              {[
                'Engine Diagnostics & Tuning',
                'Performance Brake Systems',
                'Advanced Electrical Repair',
                'Precision Wheel Alignment',
                'Express Hybrid Maintenance'
              ].map((item) => (
                <Link key={item} to="/services" className="text-slate-500 hover:text-white transition-colors text-sm font-bold italic flex items-center group">
                  <ChevronRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Links */}
          <div className="space-y-8">
            <h4 className="text-accent font-black uppercase italic tracking-widest text-sm underline decoration-accent/20 underline-offset-8">Links</h4>
            <div className="flex flex-col space-y-4 text-sm">
              <Link to="/role-selection" className="text-slate-500 hover:text-white transition-colors font-bold italic">Apply Now</Link>
              <Link to="/contact" className="text-slate-500 hover:text-white transition-colors font-bold italic">Contact Us</Link>
              <Link to="/about" className="text-slate-500 hover:text-white transition-colors font-bold italic">About Carlofy</Link>
              <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors font-bold italic">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-500 hover:text-white transition-colors font-bold italic">Terms & Condition</Link>

            </div>
          </div>

          {/* Column 4: Contacts & Social */}
          <div className="space-y-8">
            <h4 className="text-accent font-black uppercase italic tracking-widest text-sm underline decoration-accent/20 underline-offset-8">Contacts</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-3 text-slate-500 text-sm leading-relaxed font-medium">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/ijopKg57KUg3iKEP8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Talaghattapura
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <a href="https://www.facebook.com/ritish.k.7" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all border border-white/5 hover:border-[#1877F2]/20 shadow-lg group">
                  <Facebook className="w-5 h-5 fill-current" />
                </a>
                <a href="https://www.linkedin.com/in/ritish-kannur-3a20082a6/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all border border-white/5 hover:border-[#0A66C2]/20 shadow-lg">
                  <Linkedin className="w-5 h-5 fill-current" />
                </a>
                <a href="https://www.instagram.com/ritish1808/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-[#E4405F] hover:bg-[#E4405F]/10 transition-all border border-white/5 hover:border-[#E4405F]/20 shadow-lg">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          <div className="hidden md:block" /> {/* Empty spacer for desktop symmetry */}

          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] italic text-center">
            Copyright 2026 <span className="text-accent font-black">Carlofy</span>. All Rights Reserved
          </p>

          <div className="flex justify-center md:justify-end">
            <button
              onClick={scrollToTop}
              className="w-12 h-12 bg-white/5 hover:bg-accent border border-white/10 hover:border-accent rounded-full flex items-center justify-center transition-all duration-500 group shadow-2xl hover:shadow-accent/40"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-slate-500 group-hover:text-black group-hover:-translate-y-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
