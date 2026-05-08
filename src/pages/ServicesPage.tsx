import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Settings,
  Battery,
  Droplets,
  Gauge
} from 'lucide-react';

export const ServicesPage = () => {
  const services = [
    { title: 'Full System Diagnostics', desc: 'Comprehensive AI-driven scan of all onboard electronics and modules.', icon: Gauge },
    { title: 'Brake System Overhaul', desc: 'Ceramic pad installation and fluid transfusion for zero-fade braking.', icon: ShieldCheck },
    { title: 'Performance Tuning', desc: 'Custom software maps and module programming for peak power.', icon: Zap },
    { title: 'Suspension Geometry', desc: 'Laser-guided alignment and damper calibration for aggressive handling.', icon: Settings },
    { title: 'Battery Health Check', desc: 'Cell-level analysis and charging profile optimization for EV systems.', icon: Battery },
    { title: 'Fluid Management', desc: 'OEM-spec synthetic fluid replacement for optimal operation.', icon: Droplets },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-accent/30">
      <PublicNavbar />
      
      <main className="pt-40">
        {/* Hero Section */}
        <section className="px-6 pb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-tight mb-8">
              Expert <span className="text-accent text-glow-accent">Precision</span> <br />
              <span className="text-gradient">Catalog.</span>
            </h1>

            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl mx-auto italic uppercase text-xs tracking-[0.4em] mb-20 opacity-60">
              Validated Solutions For Performance Engineering.
            </p>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section className="px-6 mb-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 group glass-card-hover"

              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-all ring-1 ring-white/10 ring-inset shadow-[0_0_20px_rgba(217,255,63,0.1)]">
                  <service.icon className="w-8 h-8 text-accent group-hover:text-black transition-colors" />
                </div>

                
                <h3 className="text-2xl font-black text-white italic uppercase mb-4 leading-tight group-hover:text-accent transition-colors">{service.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">{service.desc}</p>
                
                {/* Book Now button removed as requested */}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Notice */}
        <section className="py-20 px-6 max-w-[1400px] mx-auto mb-32">
          <div className="glass-card p-10 border-accent/20 bg-accent/[0.02] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] opacity-10 pointer-events-none" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <h3 className="text-3xl font-black text-white italic mb-4 uppercase italic">Custom Project?</h3>
                  <p className="text-slate-400 font-medium">For high-performance tuning, track preparation, or vintage restoration, please contact our master technicians directly for a tiered consultation.</p>
               </div>
               <div className="flex md:justify-end">
                 <Link to="/contact" className="btn-primary flex items-center space-x-4">
                   <span>Consult a Specialist</span>
                   <ChevronRight className="w-5 h-5" />
                 </Link>
               </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
