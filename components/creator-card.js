"use client";
import React, { useState } from "react";
import { Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const CreatorCard = ({
  name,
  avatar,
  specialty,
  recipesCount,
  followersCount,
  className,
}) => {
  const [following, setFollowing] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl p-5 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 group/creator",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-neutral-200 dark:border-zinc-700 group-hover/creator:border-orange-500 transition-colors duration-300">
          <img src={avatar} alt={name} className="object-cover w-full h-full" />
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold text-neutral-900 dark:text-zinc-100 group-hover/creator:text-orange-500 transition-colors duration-200 text-base">
            {name}
          </h4>
          <span className="text-xs font-semibold text-orange-500 block mb-1">
            {specialty}
          </span>
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-neutral-400" />
              <span>{recipesCount} Recipes</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-neutral-400" />
              <span>{followersCount} Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => setFollowing(!following)}
        className={cn(
          "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm",
          following
            ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-700"
            : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/10"
        )}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
};
