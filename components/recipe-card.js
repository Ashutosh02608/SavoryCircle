"use client";
import React, { useState, useEffect } from "react";
import { Star, Clock, Bookmark, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export const RecipeCard = ({
  title,
  image,
  category,
  cookTime,
  rating,
  author,
  id,
  className,
}) => {
  const [saved, setSaved] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Synchronize initial bookmark state from Firestore database
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser && id) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const savedList = userData.savedRecipes || [];
            setSaved(savedList.includes(id));
          }
        } catch (err) {
          console.error("Error fetching recipe card bookmark status:", err);
        }
      } else {
        setSaved(false);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5 relative to center
    const mouseX = x / width - 0.5;
    const mouseY = y / height - 0.5;
    
    // Rotate max 10 degrees on hover
    setRotateX(-mouseY * 10);
    setRotateY(mouseX * 10);
    setGlarePos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      if (nextSaved) {
        await updateDoc(userDocRef, {
          savedRecipes: arrayUnion(id),
        });
      } else {
        await updateDoc(userDocRef, {
          savedRecipes: arrayRemove(id),
        });
      }
    } catch (err) {
      console.error("Error syncing recipe card bookmark status:", err);
      setSaved(!nextSaved);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
        transition: isHovered ? "transform 0.05s ease-out, box-shadow 0.2s ease" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
      }}
      className={cn(
        "rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800/80 shadow-md hover:shadow-2xl hover:shadow-orange-500/5 dark:hover:shadow-orange-500/10 transition-all duration-300 group/card flex flex-col h-full relative select-none",
        className
      )}
    >
      {/* Dynamic 3D Glare Reflection */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 160px at ${glarePos.x}px ${glarePos.y}px, rgba(255, 255, 255, 0.12), transparent)`,
          }}
        />
      )}

      {/* Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover/card:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm z-10">
          {category}
        </span>
        {/* Bookmark Icon */}
        <button
          onClick={handleSaveClick}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 z-20",
            saved
              ? "bg-orange-500 text-white"
              : "bg-white/80 dark:bg-zinc-900/80 text-neutral-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900"
          )}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Description Content */}
      <div className="p-5 flex flex-col flex-1 z-10">
        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-zinc-400 mb-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-neutral-900 dark:text-zinc-100 text-lg mb-2 line-clamp-1 group-hover/card:text-orange-500 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-zinc-400 mb-4">
          By <span className="font-semibold">{author}</span>
        </p>

        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href={`/recipes/${id || "demo"}`}
            className="text-sm font-semibold text-orange-500 flex items-center gap-1 hover:text-orange-600 transition-colors duration-200"
          >
            <span>View Recipe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};
