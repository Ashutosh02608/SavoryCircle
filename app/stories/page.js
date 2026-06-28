"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { NAV_ITEMS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, Clock, X, Sparkles, ChevronRight, User } from "lucide-react";

const STORIES_LIST = [
  {
    id: "s1",
    title: "The Art of Sourdough Fermentation",
    subtitle: "How time, temperature, and wild yeasts transform flour and water into culinary gold.",
    author: "BakeMaster Sam",
    date: "June 25, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    quote: "Sourdough is not just a recipe; it is a relationship with living cultures that respond to their environment.",
    content: [
      {
        type: "paragraph",
        text: "Sourdough bread-making is a beautiful intersection of science, patience, and sensory observation. Unlike commercial breads made with isolated baker's yeast, authentic sourdough depends on a wild starter—a symbiotic culture of wild yeasts and lactic acid bacteria nurtured from nothing but flour, water, and air."
      },
      {
        type: "header",
        text: "The Importance of Autolyse"
      },
      {
        type: "paragraph",
        text: "The process begins with the autolyse: mixing flour and water and letting it rest before adding starter or salt. During this rest, enzymes trigger, gluten begins to form automatically, and starches break down into sugars, which will later feed the wild yeasts. Skipping this rest makes the dough harder to work with and reduces oven spring."
      },
      {
        type: "header",
        text: "Bulk Fermentation & Temperature"
      },
      {
        type: "paragraph",
        text: "Once the starter and salt are combined, the bulk fermentation (first rise) begins. Instead of kneading, we stretch and fold the dough to build structure gently. Temperature is critical: wild yeasts prefer a warm environment (78°F/25°C), while bacteria generate lactic acid, creating sourdough's signature tang. Watching the dough expand, grow bubble pockets, and feel domed at the edges tells you when it's ready."
      },
      {
        type: "header",
        text: "The Magic of the Dutch Oven"
      },
      {
        type: "paragraph",
        text: "After shaping and a long cold rest (cold retard) in the refrigerator, it is time to bake. Preheating a heavy cast-iron Dutch oven is a game-changer. When the scored cold dough is dropped inside and covered, the heat releases moisture from the dough, trapping steam. This steam keeps the outer crust soft, allowing the loaf to expand fully (the 'oven spring') before forming a deep golden, blistered shell."
      }
    ]
  },
  {
    id: "s2",
    title: "Why Deglazing Changes Everything",
    subtitle: "Unlock the hidden flavor locked in the caramelized bits at the bottom of your pan.",
    author: "Chef Isabella",
    date: "June 23, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    quote: "Washing a pan that has delicious seared bits stuck to the bottom is throwing liquid gold down the drain.",
    content: [
      {
        type: "paragraph",
        text: "Have you ever seared a chicken breast or steak and noticed a dark, crusty glaze stuck to the bottom of the skillet? In classical French culinary terms, this caramelized glaze is called the 'fond' (French for foundation). It is the condensed residue of proteins, sugars, and fats left behind by searing heat, and it represents the deepest source of savory flavor in cooking."
      },
      {
        type: "header",
        text: "The Chemical Miracle of Maillard"
      },
      {
        type: "paragraph",
        text: "The fond is created via the Maillard reaction—a chemical reaction between amino acids and reducing sugars that occurs when food is cooked at high heat. This reaction produces hundreds of new flavor compounds, which is why seared meat tastes infinitely richer than boiled meat. The caramelized residue is dry and stuck to the metal, but it is highly soluble in liquids."
      },
      {
        type: "header",
        text: "Choosing Your Deglazing Liquid"
      },
      {
        type: "paragraph",
        text: "To unlock this flavor, we deglaze. While the skillet is still hot on the stovetop, pour in a cold liquid. The thermal shock combined with the liquid's acidity instantly loosens the fond. You can use dry white or red wine (which adds acidity and fruitiness), chicken or beef stock, vinegar, or even fresh citrus juice. Avoid using plain water, as it dilutes the flavor instead of enhancing it."
      },
      {
        type: "header",
        text: "Finishing the Pan Sauce"
      },
      {
        type: "paragraph",
        text: "As the liquid bubbles, scrape the bottom of the pan with a wooden spoon. The fond dissolves, infusing the liquid with a rich, savory essence. Simmer to reduce by half to concentrate the flavor. Turn off the heat and stir in cold butter (monter au beurre) or heavy cream for a glossy, emulsified restaurant-quality pan sauce in seconds."
      }
    ]
  },
  {
    id: "s3",
    title: "The Plant-Based Cheese Revolution",
    subtitle: "How nuts, seeds, and traditional fermentation cultures are creating dairy alternatives.",
    author: "Sarah Green",
    date: "June 20, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    quote: "Artisanal plant cheese isn't trying to mimic dairy; it is utilizing identical microbiological aging processes on nut milk bases.",
    content: [
      {
        type: "paragraph",
        text: "For years, opting for a plant-based diet meant giving up the complex, savory pleasure of cheese. Early vegan alternatives were rubbery, oil-based, and lacked depth. Today, a new generation of artisanal cheesemakers is turning to traditional fermentation methods to create plant-based wheels that stand on their own merits."
      },
      {
        type: "header",
        text: "Culturing Nut Milks"
      },
      {
        type: "paragraph",
        text: "The secret to real plant-based cheese is simple: treat nut milk the same way you treat dairy. By soaking raw cashews, blending them with water into a thick cream, and adding lactic acid starter cultures, cheesemakers trigger fermentation. Over 24 to 48 hours, bacteria consume sugars in the nuts, producing lactic acid. This lowers the pH, giving the base a natural sour tang."
      },
      {
        type: "header",
        text: "Aging and Mold Culturing"
      },
      {
        type: "paragraph",
        text: "Just like traditional Camembert or Roquefort, these cheeses are inoculated with specific molds (such as Penicillium candidum). The wheels are placed in temperature and humidity-controlled aging caves. Over weeks, the mold grows a white bloom on the rind, breaking down proteins and fats in the cashews to create a buttery texture and earthy aroma."
      },
      {
        type: "header",
        text: "A Culinary Frontier"
      },
      {
        type: "paragraph",
        text: "By replacing dairy fat with healthy, plant-based fats, these cheeses offer identical complexity on a charcuterie board. From tangy cashew chèvre to sharp macadamia cheddar, plant-based cheese has transitioned from a dietary compromise to an exciting, innovative culinary art form."
      }
    ]
  },
  {
    id: "s4",
    title: "5 Herbs to Level Up Any Dish",
    subtitle: "A quick guide to using fresh basil, rosemary, thyme, cilantro, and mint like a pro.",
    author: "Elena Rostova",
    date: "June 18, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
    quote: "Herbs are the volume dials of cooking. Knowing when and how to use them can salvage any dish.",
    content: [
      {
        type: "paragraph",
        text: "One of the simplest ways to transform a dish from flat to restaurant-quality is using fresh herbs. They add color, aroma, and localized flavor bursts that dried herbs cannot replicate. Understanding the difference between soft and hardy herbs is the key to unlocking their potential."
      },
      {
        type: "header",
        text: "Hardy Herbs vs. Soft Herbs"
      },
      {
        type: "paragraph",
        text: "Hardy herbs (like rosemary, thyme, and oregano) have woody stems and tough leaves. Their essential oils are volatile only when heated, so they should be added early in the cooking process (roasting, stewing, or simmering) to infuse the dish. Soft herbs (like basil, cilantro, parsley, and mint) have tender stems and delicate leaves. High heat destroys their flavor, so they should be added at the very end of cooking or used as a raw garnish."
      },
      {
        type: "header",
        text: "The Essential Five"
      },
      {
        type: "paragraph",
        text: "1. **Basil**: Sweet, slightly peppery, and anise-scented. Pairs naturally with tomatoes, olive oil, and mozzarella. Tear basil instead of cutting it with a knife to prevent the leaves from bruising and turning black.\n2. **Rosemary**: Earthy, pinene-like, and highly aromatic. Excellent when roasted with potatoes, garlic, or lamb. Use sparingly as its flavor can easily overpower a dish.\n3. **Thyme**: Subtle, citrusy, and versatile. It is the backbone of stocks, sauces, and roasted meats. Simply slide your fingers down the stem to strip the tiny leaves off.\n4. **Cilantro**: Bright, citrusy, and refreshing. Crucial for salsa, curries, and tacos. The stems are packed with flavor and have a nice crunch, so chop and use them along with the leaves.\n5. **Mint**: Cool, sweet, and refreshing. Cuts through rich, fatty dishes (like roasted lamb) and adds brightness to grain salads, dressings, and desserts."
      }
    ]
  }
];

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState(null);

  const openStoryModal = (story) => {
    setSelectedStory(story);
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    }
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
    if (typeof window !== "undefined") {
      document.body.style.overflow = ""; // Re-enable background scrolling
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col justify-between">
      {/* Floating Navbar */}
      <FloatingNav navItems={NAV_ITEMS} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 w-full flex-1">
        {/* Header Hero Section */}
        <section className="mb-12 text-center md:text-left relative py-8 px-6 rounded-3xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-neutral-200/40 dark:border-zinc-800/40 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold font-sans">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Culinary Chronicles</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-zinc-100 font-sans leading-tight">
              Food Stories & Kitchen Guides
            </h1>
            <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Dive deep into cooking science, sourdough guides, seasoning tricks, and the stories behind your favorite food trends written by our cooking community.
            </p>
          </div>
        </section>

        {/* Stories list */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORIES_LIST.map((story) => (
            <div
              key={story.id}
              className="rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
            >
              {/* Cover Photo */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-zinc-800 select-none">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Story Details Card */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-450 dark:text-zinc-500 uppercase tracking-widest select-none">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    {story.date}
                  </span>
                  <span className="w-1 h-1 bg-neutral-250 dark:bg-zinc-850 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    {story.readTime}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-extrabold text-xl text-neutral-900 dark:text-zinc-50 font-sans leading-snug group-hover:text-orange-500 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-2 leading-relaxed font-sans line-clamp-2">
                    {story.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 dark:text-zinc-550 font-sans">
                    By <span className="font-bold text-neutral-600 dark:text-zinc-300">{story.author}</span>
                  </span>
                  <button
                    onClick={() => openStoryModal(story)}
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer font-sans"
                  >
                    <span>Read Story</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Story Detailed View Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStoryModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 md:p-6"
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card body
              className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200/50 dark:border-zinc-800/60 shadow-2xl overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0 select-none">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover filter brightness-[0.7]"
                />
                
                {/* Close Button */}
                <button
                  onClick={closeStoryModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                  title="Close Story"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Cover Details */}
                <div className="absolute bottom-6 left-6 right-6 text-white max-w-2xl">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedStory.date}
                    </span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedStory.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight font-sans leading-tight">
                    {selectedStory.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content Details */}
              <div className="p-6 md:p-8 flex flex-col gap-6">
                
                {/* Author row */}
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100 dark:border-zinc-800/60 select-none">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-400 dark:text-zinc-500 font-sans">Written by</span>
                    <span className="font-bold text-xs text-neutral-700 dark:text-zinc-200 font-sans">
                      {selectedStory.author}
                    </span>
                  </div>
                </div>

                {/* Snippet / Subtitle */}
                <p className="text-sm font-semibold text-neutral-500 dark:text-zinc-400 leading-relaxed font-sans border-l-4 border-orange-500 pl-4">
                  {selectedStory.subtitle}
                </p>

                {/* Quote block */}
                {selectedStory.quote && (
                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 italic text-sm text-neutral-700 dark:text-zinc-300 text-center font-sans font-medium">
                    "{selectedStory.quote}"
                  </div>
                )}

                {/* Article paragraphs */}
                <div className="space-y-6 text-sm md:text-base text-neutral-700 dark:text-zinc-350 leading-relaxed font-sans">
                  {selectedStory.content.map((sec, idx) => {
                    if (sec.type === "header") {
                      return (
                        <h3 key={idx} className="font-extrabold text-lg text-neutral-900 dark:text-zinc-100 mt-4 font-sans">
                          {sec.text}
                        </h3>
                      );
                    }
                    // Handle markdown-like formatting in text
                    return (
                      <p key={idx} className="font-sans whitespace-pre-line">
                        {sec.text.split("\n").map((line, lIdx) => {
                          if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) {
                            // Format list items
                            const boldIndex = line.indexOf("**");
                            if (boldIndex !== -1) {
                              const endBold = line.indexOf("**", boldIndex + 2);
                              if (endBold !== -1) {
                                const listHead = line.slice(0, boldIndex);
                                const boldText = line.slice(boldIndex + 2, endBold);
                                const listBody = line.slice(endBold + 2);
                                return (
                                  <span key={lIdx} className="block pl-4 mt-2">
                                    {listHead}<strong className="text-neutral-900 dark:text-zinc-100 font-bold">{boldText}</strong>{listBody}
                                  </span>
                                );
                              }
                            }
                          }
                          return <span key={lIdx}>{line}<br /></span>;
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Close Trigger Button */}
                <div className="pt-6 border-t border-neutral-100 dark:border-zinc-800/60 flex justify-end">
                  <button
                    onClick={closeStoryModal}
                    className="px-6 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-neutral-600 dark:text-zinc-300 transition-all cursor-pointer font-sans"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-950/80 backdrop-blur-md py-12 text-sm text-neutral-500 dark:text-zinc-400 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-base">
              S
            </div>
            <span className="font-extrabold text-neutral-900 dark:text-zinc-100 text-lg tracking-tight font-sans">
              SavoryCircle
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-orange-500 transition-colors font-sans">Home</Link>
            <Link href="/recipes" className="hover:text-orange-500 transition-colors font-sans">Recipes</Link>
            <Link href="/privacy" className="hover:text-orange-500 transition-colors font-sans">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors font-sans">Terms</Link>
          </div>

          <div className="flex items-center gap-4 text-neutral-455">
            <Link href="#" className="hover:text-orange-500 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
            <Link href="#" className="hover:text-orange-500 transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
            <Link href="#" className="hover:text-orange-500 transition-colors" aria-label="Github">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-8 border-t border-neutral-100 dark:border-zinc-900/60 text-center text-xs text-neutral-400 font-sans">
          © {new Date().getFullYear()} SavoryCircle. Made with love for good food.
        </div>
      </footer>
    </div>
  );
}
