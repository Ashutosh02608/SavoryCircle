"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Icon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export const CanvasCard = ({
  title,
  subtitle,
  icon,
  children,
  className,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "border border-neutral-200 dark:border-zinc-800/80 rounded-2xl group/canvas-card flex items-center justify-center max-w-sm w-full mx-auto p-6 relative overflow-hidden bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-orange-500/30 shadow-sm",
        className
      )}
    >
      {/* Corner SVG cross decorations */}
      <Icon className="absolute h-5 w-5 -top-2.5 -left-2.5 dark:text-zinc-600 text-neutral-350 pointer-events-none" />
      <Icon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 dark:text-zinc-600 text-neutral-350 pointer-events-none" />
      <Icon className="absolute h-5 w-5 -top-2.5 -right-2.5 dark:text-zinc-600 text-neutral-350 pointer-events-none" />
      <Icon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 dark:text-zinc-600 text-neutral-350 pointer-events-none" />

      {/* revealed dots on card hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full absolute inset-0 z-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Default displayed icon */}
        <div className="text-center group-hover/canvas-card:-translate-y-3 group-hover/canvas-card:opacity-0 transition duration-300 w-full mx-auto flex flex-col items-center justify-center gap-2">
          {icon && React.cloneElement(icon, { className: cn("w-10 h-10", icon.props?.className) })}
          {subtitle && (
            <span className="text-xs font-semibold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider font-sans mt-2">
              {subtitle}
            </span>
          )}
        </div>
        
        {/* hover dynamic revealed title */}
        <div className="absolute opacity-0 group-hover/canvas-card:opacity-100 group-hover/canvas-card:-translate-y-1 transition duration-300 text-center flex flex-col items-center justify-center gap-2 pointer-events-none">
          <h2 className="text-neutral-900 dark:text-white text-2xl font-black font-sans group-hover/canvas-card:text-white select-none">
            {title}
          </h2>
          {subtitle && (
            <span className="text-[10px] font-bold text-neutral-500 group-hover/canvas-card:text-orange-300 dark:group-hover/canvas-card:text-orange-400 uppercase tracking-widest font-sans select-none">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
