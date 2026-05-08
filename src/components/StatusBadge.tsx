import { Clock, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { ServiceStatus } from '../types';
import { cn } from '../lib/utils';

export const StatusBadge = ({ status }: { status: ServiceStatus }) => {
  const styles = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    IN_PROGRESS: "bg-accent/10 text-accent border-accent/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CANCELLED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const icons = {
    PENDING: <Clock className="w-3 h-3 mr-1" />,
    IN_PROGRESS: <Settings className="w-3 h-3 mr-1 animate-spin-slow" />,
    COMPLETED: <CheckCircle2 className="w-3 h-3 mr-1" />,
    CANCELLED: <AlertCircle className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border flex items-center w-fit", styles[status])}>
      {icons[status]}
      {status.replace('_', ' ')}
    </span>
  );
};
