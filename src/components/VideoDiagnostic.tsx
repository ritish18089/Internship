import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Play, 
  Square,
  Zap,
  Cpu,
  BrainCircuit,
  Wand2,
  Trash2,
  Search,
  Camera,
  Maximize2,
  Hourglass,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, VisualFault, SymptomType } from '../types';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

interface VideoDiagnosticProps {
  cars: Car[];
}

export const VideoDiagnostic = ({ cars }: VideoDiagnosticProps) => {
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [symptomType, setSymptomType] = useState<SymptomType>('EXHAUST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<number | null>(null);
  const [logs, setLogs] = useState<VisualFault[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (cars.length > 0 && !selectedCar) {
      setSelectedCar(cars[0].id);
    }
  }, [cars]);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/visual-diagnostic/my');
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch visual diagnostic logs', err);
    }
  };

  const handleDeleteLog = async (id: number) => {
    if (!window.confirm('Delete this diagnostic record permanently?')) return;
    try {
      await api.delete(`/visual-diagnostic/${id}`);
      setLogs(logs.filter(l => l.id !== id));
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCar) {
      alert('Please select a vehicle first.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result as string;
        await handleSubmit(file.name, base64Content);
      };
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (fileName: string, fileUrl: string) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting diagnostic with file length:', fileUrl.length);
      const response = await api.post('/visual-diagnostic/analyze', {
        carId: selectedCar,
        symptomType: symptomType,
        fileName: fileName,
        fileUrl: fileUrl
      });
      setLastSubmittedId(response.data.id);
      fetchLogs();
    } catch (err) {
      console.error('Submission failed', err);
      alert('Diagnostic submission failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="glass-card p-10 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
              <Video className="w-6 h-6 text-accent" /> 
              Expert <span className="text-accent/60">Verification</span>
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Human-Verified Mechanical Diagnostics</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Vehicle</label>
                <select 
                  value={selectedCar} 
                  onChange={(e) => setSelectedCar(e.target.value)}
                  className="input-field"
                >
                  <option value="" className="bg-[#08090c] text-slate-400">Select a car...</option>
                  {cars.map(c => <option key={c.id} value={c.id} className="bg-[#08090c] text-white">{c.brand} {c.model}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Symptom</label>
                <select 
                  value={symptomType} 
                  onChange={(e) => setSymptomType(e.target.value as SymptomType)}
                  className="input-field"
                >
                  <option value="EXHAUST" className="bg-[#08090c] text-white">Exhaust Smoke Color</option>
                  <option value="FLUID_LEAK" className="bg-[#08090c] text-white">Under-body Fluid Leak</option>
                  <option value="TYRE_WEAR" className="bg-[#08090c] text-white">Tread/Tyre Condition</option>
                  <option value="ENGINE_BAY" className="bg-[#08090c] text-white">Engine Bay Inspection</option>
                  <option value="OTHER" className="bg-[#08090c] text-white">General Visual Faults</option>
                </select>
              </div>
            </div>

            <div className="relative group">
              <div className={cn(
                "h-72 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden",
                isSubmitting ? "border-accent bg-accent/5" : "border-white/10 hover:border-accent/30 bg-white/[0.02]"
              )}>
                {isSubmitting ? (
                  <div className="flex flex-col items-center gap-8">
                    <div className="relative w-24 h-24">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-accent"
                      />
                      <div className="absolute inset-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-white uppercase italic tracking-widest">Uploading Evidence</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Transmitting to Technical Center...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(217,255,63,0.1)]">
                      <Upload className="w-8 h-8 text-accent" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm font-bold text-white">Submit Diagnostic Video</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed px-12">
                        Our technicians will review your footage and suggest the best service. <br/>Supports MP4, MOV, WEBM
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="video/*" 
                        onChange={handleFileUpload} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-primary py-4 px-12 flex items-center gap-3 shadow-[0_0_30px_rgba(217,255,63,0.2)]"
                      >
                        <Upload className="w-4 h-4" /> Select Video File
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info/Status Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {lastSubmittedId ? (
              <motion.div 
                key="submitted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 border-accent/20 bg-accent/[0.02] flex flex-col items-center text-center space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(217,255,63,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">Request <span className="text-accent">Submitted</span></h4>
                  <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                    We've received your diagnostic video. Our technicians will analyze the footage and get back to you shortly with a recommended service plan.
                  </p>
                </div>
                <div className="pt-4 w-full grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Request ID</p>
                      <p className="text-sm font-bold text-white font-mono">DIAG-{lastSubmittedId}</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Est. Response</p>
                      <p className="text-sm font-bold text-accent italic">&lt; 2 Hours</p>
                   </div>
                </div>
                <button onClick={() => setLastSubmittedId(null)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Submit Another Request</button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 glass-card border-dashed border-white/5 text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-white/5 animate-ping" />
                  <Hourglass className="w-10 h-10 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-2">Technical Queue</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
                    Our master technicians are currently online. <br/>Upload your video now for priority verification.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 w-full">
                   {[
                     { label: 'Step 1', text: 'Upload clear video of the symptom' },
                     { label: 'Step 2', text: 'Admin verifies the mechanical fault' },
                     { label: 'Step 3', text: 'Receive suggested service & book' }
                   ].map((step, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 text-left">
                        <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded-lg shrink-0">{step.label}</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{step.text}</p>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Diagnostic <span className="text-slate-500">History</span></h3>
          <button onClick={fetchLogs} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Refresh Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-5">Vehicle</th>
                <th className="px-8 py-5">Symptom</th>
                <th className="px-8 py-5">Expert Findings</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-white uppercase italic">{log.car?.brand} {log.car?.model}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.car?.number}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">{log.symptomType}</span>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <p className={cn(
                      "text-xs font-bold truncate",
                      log.status === 'PENDING' ? "text-slate-600 italic" : "text-slate-300"
                    )} title={log.detectedFault}>
                      {log.detectedFault}
                    </p>
                    {log.status === 'REVIEWED' && (
                      <p className="text-[9px] text-accent mt-1 uppercase font-black truncate">{log.technicianRecommendations}</p>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                      log.status === 'PENDING' 
                        ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-400" 
                        : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
                    )}>
                      {log.status === 'PENDING' ? <Hourglass className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {log.status}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-bold text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No diagnostic requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
