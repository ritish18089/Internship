import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Calendar, 
  Activity, 
  Shield, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Settings,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, ServiceRequest, PartReplacement, AccidentRecord } from '../types';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { StatusBadge } from './StatusBadge';

interface VehicleTwinProps {
  car: Car;
  onClose: () => void;
}

export const VehicleTwin = ({ car, onClose }: VehicleTwinProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'parts' | 'health'>('overview');
  const [twinData, setTwinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTwinData();
  }, [car.id]);

  const fetchTwinData = async () => {
    try {
      const response = await api.get(`/cars/${car.id}/twin`);
      setTwinData(response.data);
    } catch (err) {
      console.error('Failed to fetch twin data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { services = [], parts = [], accidents = [], healthScore = 0 } = twinData || {};

  const ExpiryCard = ({ label, date, icon: Icon, color }: any) => {
    const isExpired = date && new Date(date) < new Date();
    return (
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
        <div className="flex items-center gap-4">
          <div className={cn("p-2.5 rounded-xl bg-opacity-10", color)}>
            <Icon className={cn("w-4 h-4", color.replace('bg-', 'text-'))} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-white">{date || 'Not Set'}</p>
          </div>
        </div>
        {date && (
          <span className={cn(
            "text-[8px] font-black uppercase px-2 py-1 rounded-full",
            isExpired ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
          )}>
            {isExpired ? 'Expired' : 'Active'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#08090c] border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-[80vh] max-h-[800px]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Activity className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
              {car.brand} {car.model} <span className="text-accent/60 ml-2">Digital Twin</span>
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono mt-1">{car.number}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 text-slate-500 hover:text-white transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-8 py-4 border-b border-white/5 bg-white/[0.005] gap-8 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Identity', icon: FileText },
          { id: 'timeline', label: 'Timeline', icon: History },
          { id: 'parts', label: 'Parts History', icon: Wrench },
          { id: 'health', label: 'Health Index', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 pb-2 transition-all relative",
              activeTab === tab.id ? "text-accent" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="twin-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-white/5 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Vehicle Master Data
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">VIN Number</p>
                      <p className="text-sm font-bold text-white font-mono">{car.vin || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Fuel Type</p>
                      <p className="text-sm font-bold text-white uppercase">{car.fuelType || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Transmission</p>
                      <p className="text-sm font-bold text-white uppercase">{car.transmission || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Current Mileage</p>
                      <p className="text-sm font-bold text-white">{car.mileage ? car.mileage.toLocaleString() + ' KM' : '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Warranty & Compliance
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <ExpiryCard label="Insurance Expiry" date={car.insuranceExpiry} icon={Shield} color="bg-blue-500" />
                    <ExpiryCard label="PUC Certification" date={car.pucExpiry} icon={FileText} color="bg-emerald-500" />
                    <ExpiryCard label="Warranty Status" date={car.warrantyExpiry} icon={ShieldCheck} color="bg-accent" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 border-white/5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Service Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Services', value: services.length },
                    { label: 'Parts Replaced', value: parts.length },
                    { label: 'Accidents', value: accidents.length },
                    { label: 'Health Score', value: healthScore + '%', highlight: true }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-white/[0.01]">
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className={cn("text-xl font-black italic", stat.highlight ? "text-accent" : "text-white")}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="relative pl-8 border-l border-white/5 space-y-12">
                {[...services, ...accidents]
                  .sort((a: any, b: any) => new Date(b.bookingDate || b.date).getTime() - new Date(a.bookingDate || a.date).getTime())
                  .map((item: any, i) => {
                    const isService = !!item.serviceType;
                    return (
                      <div key={i} className="relative">
                        <div className={cn(
                          "absolute -left-[41px] top-0 w-4 h-4 rounded-full border-2 border-[#08090c]",
                          isService ? "bg-accent shadow-[0_0_10px_rgba(217,255,63,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        )} />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                              {item.bookingDate || item.date}
                            </p>
                            <h4 className="text-sm font-bold text-white uppercase italic tracking-tight">
                              {isService ? item.serviceType : 'Accident Reported'}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">
                              {isService ? (item.technicianNotes || 'Standard maintenance performed.') : item.description}
                            </p>
                          </div>
                          {isService && <StatusBadge status={item.status} />}
                        </div>
                      </div>
                    );
                  })}
                {services.length === 0 && accidents.length === 0 && (
                  <p className="text-slate-500 italic text-sm">No history recorded for this vehicle.</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'parts' && (
            <motion.div 
              key="parts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3">
                {parts.map((part: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-white/5">
                        <Wrench className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{part.partName}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">{part.replacementDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-accent">₹{part.cost.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {parts.length === 0 && (
                  <div className="text-center py-20">
                    <Wrench className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500 uppercase tracking-widest text-xs font-black">No major parts replaced yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div 
              key="health"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative w-48 h-48 mb-8">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-white/[0.02]"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray="552.92"
                      initial={{ strokeDashoffset: 552.92 }}
                      animate={{ strokeDashoffset: 552.92 - (552.92 * healthScore) / 100 }}
                      className={cn(
                        "transition-all duration-1000",
                        healthScore > 80 ? "text-accent" : healthScore > 50 ? "text-yellow-400" : "text-red-500"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white italic">{healthScore}%</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Health Index</span>
                  </div>
                </div>

                <div className="max-w-md">
                  <h4 className={cn(
                    "text-lg font-black uppercase italic mb-2",
                    healthScore > 80 ? "text-emerald-400" : healthScore > 50 ? "text-yellow-400" : "text-red-500"
                  )}>
                    {healthScore > 80 ? 'Optimal Condition' : healthScore > 50 ? 'Fair Condition' : 'Needs Urgent Care'}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This score is calculated based on service regularity, accident history, and parts replacement cycles. 
                    {healthScore > 80 
                      ? ' Your vehicle is in peak performance state.' 
                      : healthScore > 50 
                      ? ' Some minor maintenance might be required soon.' 
                      : ' We recommend scheduling a full diagnostic check immediately.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Engine Health', score: 95, color: 'text-emerald-400' },
                  { label: 'Electricals', score: 88, color: 'text-accent' },
                  { label: 'Suspension', score: 72, color: 'text-yellow-400' }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                      <span className={cn("text-xs font-black", stat.color)}>{stat.score}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.score}%` }}
                        className={cn("h-full", stat.color.replace('text-', 'bg-'))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Digital Twin Data</span>
        </div>
        <button 
          onClick={onClose}
          className="btn-primary py-2 px-6"
        >
          Close Twin
        </button>
      </div>
    </div>
  );
};
