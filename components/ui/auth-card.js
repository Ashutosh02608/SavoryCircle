import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const AuthCard = ({
  children,
  className,
  title,
  subtitle,
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-[480px] rounded-3xl p-6 sm:p-8 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-lg border border-neutral-200/50 dark:border-zinc-800/50 shadow-2xl relative z-50 flex flex-col gap-4 sm:gap-5 transition-all duration-300 max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]",
        className
      )}
    >
      {/* Back to Home Link */}
      <Link
        href="/"
        className="flex items-center gap-1 text-xs font-semibold text-neutral-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-500 w-fit transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-1 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-zinc-50 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm font-medium text-neutral-500 dark:text-zinc-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};
