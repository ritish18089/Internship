import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ShieldCheck, 
  Clock, 
  Maximize2, 
  Film, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  Info,
  Calendar,
  Zap,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RepairProof } from '../types';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

interface RepairProofGalleryProps {
  serviceId: string;
  showDelete?: boolean;
}

export const RepairProofGallery = ({ serviceId, showDelete = false }: RepairProofGalleryProps) => {
  const [proofs, setProofs] = useState<RepairProof[]>([]);
  const [selectedProof, setSelectedProof] = useState<RepairProof | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProofs();
  }, [serviceId]);

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedProof]);

  const fetchProofs = async () => {
    try {
      // Normalize serviceId (strip 'SR-' prefix if present)
      const cleanId = serviceId.toString().replace('SR-', '');
      const response = await api.get(`/repair-proofs/service/${cleanId}`);
      setProofs(response.data);
      if (response.data.length > 0) setSelectedProof(response.data[0]);
    } catch (err) {
      console.error('Failed to fetch repair proofs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProof = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Remove this evidence from the vault?')) return;
    try {
      await api.delete(`/repair-proofs/${id}`);
      setProofs(prev => prev.filter(p => p.id !== id));
      if (selectedProof?.id === id) {
        setSelectedProof(null);
        setIsPlaying(false);
      }
    } catch (err) {
      alert('Failed to delete evidence');
    }
  };

  const getProofLabel = (type: string) => {
    switch (type) {
      case 'BEFORE': return { label: 'Initial State', icon: Info, color: 'text-amber-400' };
      case 'DURING': return { label: 'Live Progress', icon: Zap, color: 'text-accent' };
      case 'AFTER': return { label: 'Final Quality', icon: CheckCircle2, color: 'text-emerald-400' };
      default: return { label: 'Evidence', icon: Film, color: 'text-slate-400' };
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  );

  if (proofs.length === 0) return (
    <div className="p-12 glass-card border-dashed border-white/5 text-center">
       <Film className="w-12 h-12 text-slate-800 mx-auto mb-4" />
       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No visual evidence records for this service</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Player */}
        <div className="flex-1 space-y-6">
           <AnimatePresence mode="wait">
              {selectedProof && (
                <motion.div 
                  key={selectedProof.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-video rounded-3xl overflow-hidden glass-card border-white/10 group bg-black"
                >
                   {isPlaying ? (
                     <video 
                       key={selectedProof.id}
                       src={selectedProof.videoUrl} 
                       className="w-full h-full object-contain"
                       controls
                       autoPlay
                     />
                   ) : (
                     <>
                        <img 
                          src={selectedProof.thumbnailUrl} 
                          alt="Proof" 
                          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                           <motion.button 
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => setIsPlaying(true)}
                             className="w-20 h-20 rounded-full bg-accent/90 flex items-center justify-center shadow-[0_0_30px_rgba(217,255,63,0.5)]"
                           >
                              <Play className="w-8 h-8 text-black fill-current ml-1" />
                           </motion.button>
                        </div>
                     </>
                   )}

                   {/* HUD Overlays (Only show when not playing or as custom HUD) */}
                   {!isPlaying && (
                     <>
                        <div className="absolute top-6 left-6 flex items-center gap-3">
                           <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">REC 4K PROOF</span>
                           </div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                           <div>
                              <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", getProofLabel(selectedProof.type).color)}>
                                {getProofLabel(selectedProof.type).label}
                              </p>
                              <h4 className="text-xl font-black text-white italic uppercase tracking-tight">{selectedProof.description}</h4>
                           </div>
                        </div>
                     </>
                   )}
                </motion.div>
              )}
           </AnimatePresence>

           <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-emerald-400" />
                 <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trust Verification</p>
                    <p className="text-xs font-bold text-white mt-0.5 italic">This clip is digitally signed by Carlofy Security Protocol</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Captured At</p>
                 <p className="text-xs font-mono text-white mt-0.5">
                   {new Date(selectedProof?.uploadedAt || '').toLocaleString()}
                 </p>
              </div>
           </div>
        </div>

        {/* Playlist / Evidence List */}
        <div className="w-full lg:w-80 space-y-4">
           <h3 className="text-sm font-black text-white uppercase tracking-widest italic ml-2 mb-6">Evidence Stream</h3>
           <div className="space-y-3">
              {proofs.map(proof => {
                const config = getProofLabel(proof.type);
                return (
                  <button 
                    key={proof.id}
                    onClick={() => setSelectedProof(proof)}
                    className={cn(
                      "w-full p-4 rounded-2xl border transition-all flex items-center gap-4 group",
                      selectedProof?.id === proof.id 
                        ? "bg-accent/10 border-accent/30" 
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                       <img src={proof.thumbnailUrl} className="w-full h-full object-cover opacity-50" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                       </div>
                    </div>
                    <div className="text-left min-w-0 flex-1">
                       <p className={cn("text-[8px] font-black uppercase tracking-tighter", config.color)}>{config.label}</p>
                       <p className="text-[11px] font-bold text-white truncate">{proofs.find(p => p.id === proof.id)?.description}</p>
                    </div>
                    {showDelete && (
                      <button 
                        onClick={(e) => handleDeleteProof(proof.id, e)}
                        className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Evidence"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </button>
                );
              })}
           </div>

           <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10">
              <div className="flex items-center gap-3 mb-4">
                 <Eye className="w-4 h-4 text-accent" />
                 <p className="text-[10px] font-black text-accent uppercase tracking-widest">Transparency Note</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-black tracking-tight">
                All visual evidence is stored for 90 days following completion for warranty verification and quality assurance purposes.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
