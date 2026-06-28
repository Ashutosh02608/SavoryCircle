"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}) => {
  const [active, setActive] = useState(propTabs[0]);
  const [tabs, setTabs] = useState(propTabs);
  const [hovering, setHovering] = useState(false);

  const moveSelectedTabToTop = (idx) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div
        className={cn(
          "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full gap-2 p-1.5 bg-neutral-100 dark:bg-zinc-900 rounded-full border border-neutral-200/50 dark:border-zinc-800/50 mb-12",
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.value}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              "relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 flex-1 text-center cursor-pointer",
              active.value === tab.value
                ? "text-white dark:text-zinc-950"
                : "text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200",
              tabClassName
            )}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="activeTabPill"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                className={cn(
                  "absolute inset-0 bg-orange-500 rounded-full z-0",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative z-10 block">{tab.title}</span>
          </button>
        ))}
      </div>

      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={contentClassName}
      />
    </div>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}) => {
  const active = tabs[0];
  return (
    <div className="relative w-full h-[450px] md:h-[500px]">
      {tabs.map((tab, idx) => {
        const isActive = active.value === tab.value;
        return (
          <motion.div
            key={tab.value}
            layoutId={tab.value}
            style={{
              scale: 1 - idx * 0.05,
              top: hovering ? idx * -45 : 0,
              zIndex: -idx,
              opacity: idx < 3 ? 1 - idx * 0.15 : 0,
            }}
            animate={{
              y: isActive ? [0, 15, 0] : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 18,
              y: { type: "tween", duration: 0.4, ease: "easeOut" }
            }}
            className={cn(
              "w-full h-full absolute top-0 left-0 transition-shadow duration-300 rounded-3xl",
              isActive ? "pointer-events-auto" : "pointer-events-none",
              className
            )}
          >
            {tab.content}
          </motion.div>
        );
      })}
    </div>
  );
};
