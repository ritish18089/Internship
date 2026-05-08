import { Car } from 'lucide-react';
import { cn } from '../lib/utils';

export const Logo = ({ className, size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn(
        "relative flex items-center justify-center border-2 border-accent rounded-xl rotate-45 shadow-[0_0_15px_rgba(226,255,84,0.3)]",
        sizes[size]
      )}>
        <div className="-rotate-45">
          <Car className={cn("text-accent", iconSizes[size])} />
        </div>
      </div>
      <span className={cn(
        "font-black tracking-tighter italic text-white",
        size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-4xl"
      )}>
        Carlofy
      </span>
    </div>
  );
};
