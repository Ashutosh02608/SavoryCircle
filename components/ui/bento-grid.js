import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-md p-6 dark:bg-zinc-900 dark:border-zinc-800 bg-white border border-neutral-200 flex flex-col justify-between hover:-translate-y-1",
        className
      )}
    >
      {header}
      <div className="flex flex-col flex-1">
        {icon && <div className="mb-2 text-orange-500">{icon}</div>}
        {title && (
          <div className="font-sans font-bold text-neutral-900 dark:text-zinc-100 mb-2 mt-2 text-xl">
            {title}
          </div>
        )}
        {description && (
          <div className="font-sans font-normal text-neutral-600 text-sm dark:text-zinc-400 mb-4">
            {description}
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
