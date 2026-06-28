import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const CustomButton = ({
  children,
  className,
  variant = "primary",
  onClick,
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer relative overflow-hidden flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md hover:shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700",
    secondary:
      "bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-neutral-800 dark:text-zinc-100 hover:bg-neutral-50 dark:hover:bg-zinc-800/80 shadow-sm",
    ghost:
      "bg-transparent text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800/50",
    glow:
      "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:scale-[1.02]",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
