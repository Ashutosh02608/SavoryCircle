import React from "react";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export const StatCard = ({
  value,
  label,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden group/stat h-full min-h-[140px] hover:border-orange-500/30 transition-all duration-300",
        className
      )}
    >
      {/* Canvas Reveal Effect */}
      <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          colors={[[249, 115, 22], [245, 158, 11]]} // Theme orange-to-amber colors
          dotSize={1.5}
        />
      </div>

      {/* Background Icon Accent */}
      {icon && (
        <div className="absolute -right-2 -bottom-2 text-neutral-100 dark:text-zinc-800/20 w-20 h-20 pointer-events-none group-hover/stat:scale-110 group-hover/stat:rotate-6 transition-transform duration-300 z-10">
          {React.cloneElement(icon, { className: "w-full h-full" })}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 flex flex-col justify-between h-full">
        <span className="text-3xl font-extrabold text-neutral-900 dark:text-zinc-50 tracking-tight mb-2 block">
          {value}
        </span>
        <span className="text-sm font-medium text-neutral-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
    </div>
  );
};
