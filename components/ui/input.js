import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(
  ({ className, label, icon, error, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-4 text-neutral-400 dark:text-zinc-500 pointer-events-none flex items-center justify-center">
              {React.cloneElement(icon, { className: "w-4 h-4" })}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 placeholder-neutral-400 dark:placeholder-zinc-600 text-sm rounded-full border border-neutral-200 dark:border-zinc-800 py-3 px-4 transition-all duration-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:shadow-[0_0_12px_rgba(249,115,22,0.15)] shadow-sm",
              icon && "pl-11",
              error && "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-red-500 font-medium pl-2">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
