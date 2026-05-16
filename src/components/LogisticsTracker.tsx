import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  User,
  MoreVertical,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogisticsRequest } from '../types';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

export const LogisticsTracker = () => {
  const [activeLogistics, setActiveLogistics] = useState<LogisticsRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LogisticsRequest | null>(null);

  useEffect(() => {
    fetchLogistics();
    const interval = setInterval(fetchLogistics, 5000); // Poll for live tracking
    return () => clearInterval(interval);
  }, []);

  const fetchLogistics = async () => {
    try {
      const response = await api.get('/logistics/my');
      setActiveLogistics(response.data);
      if (selectedRequest) {
        const updated = response.data.find((r: any) => r.id === selectedRequest.id);
        if (updated) setSelectedRequest(updated);
      }
    } catch (err) {
      console.error('Failed to fetch logistics', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ROUTE': return 'text-accent bg-accent/10 border-accent/20';
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'ASSIGNED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-500 bg-white/5 border-white/10';
    }
  };

  const steps = [
    { id: 'PENDING', label: 'Booking Confirmed', icon: CheckCircle2 },
    { id: 'ASSIGNED', label: 'Driver Assigned', icon: User },
    { id: 'EN_ROUTE', label: 'En Route', icon: Truck },
    { id: 'ARRIVED', label: 'Arrived at Location', icon: MapPin },
    { id: 'COMPLETED', label: 'Handover Complete', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Active List */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Active Journeys</h3>
            <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full">{activeLogistics.length}</span>
          </div>
          
          <div className="space-y-4">
            {activeLogistics.map(req => (
              <button 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={cn(
                  "w-full glass-card p-6 border transition-all text-left group relative overflow-hidden",
                  selectedRequest?.id === req.id ? "border-accent/40 bg-accent/[0.02]" : "border-white/5 hover:border-white/10"
                )}
              >
                {selectedRequest?.id === req.id && (
                  <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-xl bg-white/5">
                    <Truck className="w-4 h-4 text-slate-400 group-hover:text-accent transition-colors" />
                  </div>
                  <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border", getStatusColor(req.status))}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{req.type} JOURNEY</p>
                  <p className="text-sm font-bold text-white mt-1 uppercase italic tracking-tight">{req.serviceRequest.car?.brand} {req.serviceRequest.car?.model}</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-1 truncate">{req.pickupAddress}</p>
                </div>
              </button>
            ))}
            {activeLogistics.length === 0 && (
              <div className="glass-card p-12 text-center border-dashed border-white/5">
                <Activity className="w-8 h-8 text-slate-800 mx-auto mb-4" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No active pickups or deliveries</p>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Console */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div 
                key={selectedRequest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card h-full min-h-[600px] flex flex-col overflow-hidden"
              >
                {/* Simulated Map Header */}
                <div className="relative h-64 bg-slate-900 border-b border-white/10 overflow-hidden group">
                   {/* Futuristic Grid Pattern */}
                   <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                   
                   {/* Simulated Path */}
                   <svg className="absolute inset-0 w-full h-full">
                      <motion.path 
                        d="M 100 150 Q 250 50 400 150 T 700 100" 
                        fill="none" 
                        stroke="rgba(217,255,63,0.1)" 
                        strokeWidth="4" 
                        strokeDasharray="10 10"
                      />
                      <motion.circle 
                        cx="100" cy="150" r="4" fill="#d9ff3f" className="animate-pulse"
                      />
                      {/* Simulated Driver Icon */}
                      <motion.g
                        animate={{ 
                          x: [0, 50, 120, 180, 250],
                          y: [0, -20, 10, -30, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                         <circle cx="100" cy="150" r="12" fill="rgba(217,255,63,0.2)" />
                         <circle cx="100" cy="150" r="6" fill="#d9ff3f" />
                      </motion.g>
                   </svg>

                   <div className="absolute top-6 left-6 p-4 glass-card border-white/10 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Lat/Lng</p>
                        <p className="text-xs font-mono text-white">{selectedRequest.currentLat.toFixed(4)}, {selectedRequest.currentLng.toFixed(4)}</p>
                      </div>
                   </div>

                   <div className="absolute bottom-6 right-6 p-4 glass-card border-white/10">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Live Tracking Enabled
                      </p>
                   </div>
                </div>

                {/* Info & Steps */}
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
                   <div className="space-y-10">
                      <div>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Logistics <span className="text-accent">Details</span></h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Journey ID: LOG-{selectedRequest.id}</p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Handover Point</p>
                            <p className="text-sm font-bold text-white mt-0.5">{selectedRequest.pickupAddress}</p>
                          </div>
                        </div>

                        {selectedRequest.driverName && (
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-accent font-black">
                                {selectedRequest.driverName[0]}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Logistics Pilot</p>
                                <p className="text-sm font-bold text-white">{selectedRequest.driverName}</p>
                              </div>
                            </div>
                            <button className="p-3 rounded-xl bg-accent text-black hover:scale-105 transition-transform">
                              <Phone className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        )}

                        <div className="p-6 rounded-2xl bg-accent/[0.03] border border-accent/20 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Key</p>
                              <p className="text-2xl font-black text-accent font-mono tracking-[0.2em] mt-1">{selectedRequest.otp}</p>
                           </div>
                           <ShieldCheck className="w-10 h-10 text-accent opacity-20" />
                        </div>
                      </div>
                   </div>

                   <div className="relative pl-10 border-l border-white/5 space-y-8">
                      {steps.map((step, i) => {
                        const isPast = steps.findIndex(s => s.id === selectedRequest.status) >= i;
                        const isCurrent = step.id === selectedRequest.status;
                        
                        return (
                          <div key={step.id} className="relative">
                            <div className={cn(
                              "absolute -left-[49px] top-0 w-4 h-4 rounded-full border-2 border-[#08090c] transition-all",
                              isPast ? "bg-accent shadow-[0_0_10px_rgba(217,255,63,0.5)]" : "bg-slate-800"
                            )} />
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                isCurrent ? "bg-accent text-black" : "bg-white/5 text-slate-500"
                              )}>
                                <step.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className={cn(
                                  "text-sm font-bold transition-colors",
                                  isPast ? "text-white" : "text-slate-600"
                                )}>{step.label}</p>
                                {isCurrent && (
                                  <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1 animate-pulse">In Progress</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] glass-card flex flex-col items-center justify-center p-20 text-center space-y-8 border-dashed border-white/5">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-white/[0.02] flex items-center justify-center">
                       <Navigation className="w-12 h-12 text-slate-800" />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-white/10"
                    />
                 </div>
                 <div className="max-w-xs">
                    <p className="text-sm font-black text-white uppercase tracking-widest">Command Center Offline</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed mt-4">
                      Select an active journey from the list to initialize real-time satellite tracking and logistics monitoring.
                    </p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
