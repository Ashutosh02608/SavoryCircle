"use client";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { UtensilsCrossed, User, LogOut, Plus, Bookmark } from "lucide-react";

export const FloatingNav = ({ className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious();

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  const navLinks = [
    { name: "Recipes", link: "/recipes" },
    { name: "Categories", link: "/categories" },
    { name: "Community", link: "/creators" },
    { name: "Stories", link: "/stories" },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex w-[90%] md:w-[85%] max-w-6xl fixed top-6 inset-x-0 mx-auto border border-neutral-200 dark:border-zinc-800 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-lg z-[5000] px-4 md:px-6 py-2.5 md:py-3 items-center justify-between transition-all duration-300",
          className
        )}
      >
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none shrink-0">
          <motion.div
            className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#c85a32] to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md relative overflow-hidden"
            whileHover={{
              scale: 1.15,
              rotate: 360,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <UtensilsCrossed className="w-4 h-4" />
          </motion.div>
          <span className="font-extrabold text-neutral-855 dark:text-zinc-200 text-base tracking-tight font-sans transition-colors duration-300 group-hover:text-[#c85a32] dark:group-hover:text-orange-400">
            SavoryCircle
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((navItem, idx) => (
            <Link
              key={idx}
              href={navItem.link}
              className="text-neutral-550 dark:text-zinc-300 hover:text-neutral-900 dark:hover:text-white text-sm font-semibold transition-colors font-sans"
            >
              {navItem.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Auth / CTA Action Buttons */}
        <div className="flex items-center gap-3 md:gap-5">
          {user ? (
            <>
              <Link
                href="/add-recipe"
                className="hidden sm:block text-[11px] md:text-xs font-bold bg-[#c85a32] hover:bg-[#b04a25] text-white px-4 md:px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition duration-200 font-sans whitespace-nowrap"
              >
                Share a recipe
              </Link>
              
              {/* Profile dropdown trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  title={`View menu: ${user.displayName || user.email}`}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm select-none hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 focus:outline-none"
                >
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3.5 w-56 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl shadow-xl z-[6000] overflow-hidden py-2"
                    >
                      {/* Signed-in user info card */}
                      <div className="px-4 py-2 border-b border-neutral-100 dark:border-zinc-800/80 select-none">
                        <p className="text-[10px] text-neutral-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Signed in as</p>
                        <p className="text-sm font-bold text-neutral-800 dark:text-zinc-200 truncate mt-0.5">
                          {user.displayName || "Home Cook"}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-zinc-450 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Dropdown Options */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 font-sans"
                        >
                          <User className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/profile?tab=saved-recipes"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 font-sans"
                        >
                          <Bookmark className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                          <span>Saved Recipes</span>
                        </Link>

                        <Link
                          href="/add-recipe"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-800/60 transition-colors duration-150 font-sans sm:hidden"
                        >
                          <Plus className="w-4 h-4 text-neutral-400 dark:text-zinc-500" />
                          <span>Share a Recipe</span>
                        </Link>
                      </div>

                      <div className="border-t border-neutral-100 dark:border-zinc-800/80 my-1" />

                      {/* Sign out action */}
                      <div className="px-1.5 pb-0.5">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/15 transition-colors duration-150 font-sans text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs md:text-sm font-bold text-neutral-600 dark:text-zinc-300 hover:text-[#c85a32] dark:hover:text-[#c85a32] transition duration-200 font-sans pr-1"
              >
                Sign in
              </Link>
              
              <Link
                href="/add-recipe"
                className="text-[11px] md:text-xs font-bold bg-[#c85a32] hover:bg-[#b04a25] text-white px-4 md:px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition duration-200 font-sans whitespace-nowrap"
              >
                Share a recipe
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
