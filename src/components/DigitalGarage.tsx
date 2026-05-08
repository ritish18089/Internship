import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Battery, 
  Activity, 
  Shield, 
  Smartphone,
  Gauge,
  Zap,
  Radio
} from 'lucide-react';

export const DigitalGarage = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-[40px] bg-transparent border border-white/5 shadow-2xl group">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,255,63,0.05)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating Car Container */}
      <div className="absolute inset-0 flex items-center justify-center p-20">
        <motion.div 
          animate="animate"
          variants={{
            animate: {
              y: [0, -20, 0],
              rotateX: [0, 2, 0],
              rotateY: [0, -2, 0]
            }
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 w-full max-w-4xl"
        >
          {/* Shadow underneath */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/60 blur-3xl rounded-full scale-y-50 opacity-40 animate-pulse" />
          
          <img 
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2070" 
            alt="Futuristic Black Car" 
            className="w-full h-auto object-contain rounded-3xl drop-shadow-[0_20px_50px_rgba(217,255,63,0.2)]"
          />

          {/* Overlay Tech Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Hotspots */}
            <TechPoint top="20%" left="30%" label="Aerodynamics" icon={Radio} />
            <TechPoint top="45%" left="75%" label="Electric Drive" icon={Zap} />
            <TechPoint top="60%" left="15%" label="Active Chassis" icon={Gauge} />
            <TechPoint top="80%" left="50%" label="AI Core" icon={Cpu} />
          </motion.div>
        </motion.div>
      </div>

      {/* Side HUD Panels */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
        <HUDSegment icon={Battery} label="Energy" value="89%" color="bg-accent" />
        <HUDSegment icon={Activity} label="Health" value="Optimal" color="bg-cyan-400" />
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
        <HUDSegment icon={Shield} label="Security" value="Encrypted" color="bg-emerald-400" />
        <HUDSegment icon={Smartphone} label="Network" value="5G Connected" color="bg-purple-400" />
      </div>

      {/* Bottom Scanning Line */}
      <div className="absolute bottom-10 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse" />
    </div>
  );
};

const TechPoint = ({ top, left, label, icon: Icon }: { top: string, left: string, label: string, icon: any }) => (
  <div className="absolute flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl" style={{ top, left }}>
    <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
    <Icon className="w-4 h-4 text-accent" />
    <span className="text-[9px] font-black uppercase tracking-widest text-white italic">{label}</span>
  </div>
);

const HUDSegment = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="glass-card p-5 border-l-2 border-l-white/5 hover:border-l-accent transition-all group overflow-hidden">
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl bg-white/5 group-hover:${color}/10 transition-colors`}>
        <Icon className={`w-4 h-4 text-slate-500 group-hover:${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-xs font-black text-white italic uppercase tracking-tighter">{value}</p>
      </div>
    </div>
  </div>
);
