"use client";
import React, { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Tabs } from "@/components/ui/tabs";
import { CustomButton } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Star,
  Bookmark,
  ArrowLeft,
  Check,
  Flame,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Share2,
} from "lucide-react";

// Mock detailed recipes data
const MOCK_RECIPE_DETAILS = {
  r1: {
    id: "r1",
    title: "Creamy Tuscan Garlic Chicken",
    description: "This recipe combines rich, sun-dried tomatoes, fresh spinach, and tender garlic-infused chicken breasts in a creamy sauce that pairs perfectly with pasta or crusty bread. Simple enough for weeknights, but fancy enough for dinner guests!",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    category: "Gourmet",
    prepTime: "15 mins",
    cookTime: "20 mins",
    totalTime: "35 mins",
    servings: 4,
    author: "Chef Isabella",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 4.9,
    reviewsCount: 128,
    difficulty: "Medium",
    ingredients: [
      { name: "chicken breasts (halved horizontally)", quantity: 2, unit: "large" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
      { name: "Italian seasoning", quantity: 1, unit: "tsp" },
      { name: "Salt and black pepper", quantity: null, unit: "to taste" },
      { name: "butter", quantity: 1, unit: "tbsp" },
      { name: "garlic cloves (minced)", quantity: 4, unit: "" },
      { name: "chicken broth", quantity: 0.5, unit: "cup" },
      { name: "heavy cream", quantity: 0.5, unit: "cup" },
      { name: "grated Parmesan cheese", quantity: 0.33, unit: "cup" },
      { name: "sun-dried tomatoes (chopped)", quantity: 0.5, unit: "cup" },
      { name: "fresh baby spinach", quantity: 2, unit: "cups" }
    ],
    directions: [
      {
        step: 1,
        title: "Prep the Chicken",
        description: "Season chicken cutlets on both sides with Italian seasoning, salt, and pepper.",
        timer: null
      },
      {
        step: 2,
        title: "Sear the Chicken",
        description: "Heat olive oil in a large skillet over medium-high heat. Add chicken and cook for 5-6 minutes on each side until golden brown and cooked through. Transfer chicken to a plate and keep warm.",
        timer: 360,
        timerLabel: "Sear Chicken (per side)"
      },
      {
        step: 3,
        title: "Sauté Aromatics",
        description: "In the same skillet, reduce heat to medium. Add butter and minced garlic. Sauté for about 1 minute until fragrant.",
        timer: 60,
        timerLabel: "Sauté Garlic"
      },
      {
        step: 4,
        title: "Build the Sauce",
        description: "Pour in the chicken broth and scrape up any caramelized brown bits from the bottom of the pan (deglazing!). Let it simmer for 2 minutes. Stir in heavy cream, Parmesan cheese, and sun-dried tomatoes. Simmer for 3 minutes until cheese is melted and sauce thickens slightly.",
        timer: 180,
        timerLabel: "Simmer Sauce"
      },
      {
        step: 5,
        title: "Wilt Spinach",
        description: "Add baby spinach and cook until wilted (about 1-2 minutes).",
        timer: 90,
        timerLabel: "Wilt Spinach"
      },
      {
        step: 6,
        title: "Combine and Serve",
        description: "Return chicken and any juices to the skillet. Spoon the sauce over the chicken and simmer for 2 minutes until heated through. Serve immediately.",
        timer: 120,
        timerLabel: "Final Simmer"
      }
    ],
    nutrition: [
      { name: "Calories", value: "420", dv: "21%" },
      { name: "Protein", value: "35g", dv: "70%" },
      { name: "Carbohydrates", value: "8g", dv: "3%" },
      { name: "Dietary Fiber", value: "2g", dv: "8%" },
      { name: "Fat", value: "28g", dv: "43%" },
      { name: "Sodium", value: "450mg", dv: "20%" }
    ],
    reviews: [
      { name: "Sarah J.", rating: 5, date: "June 24, 2026", text: "Absolutely stunning recipe! The sauce is incredibly creamy and has so much depth. My family devoured it." },
      { name: "David M.", rating: 5, date: "June 22, 2026", text: "Deglazing the pan with chicken broth adds so much flavor. This has entered our weekly dinner rotation!" },
      { name: "Emily R.", rating: 4, date: "June 19, 2026", text: "Super tasty and easy. I added a squeeze of fresh lemon juice at the end to cut through the richness." }
    ]
  },
  r2: {
    id: "r2",
    title: "Artisanal Sourdough Bread",
    description: "From crusty sourdough to chewy crumb, learn how to bake a beautiful, bakery-quality loaf of sourdough bread at home. Requires minimal specialized equipment but plenty of patience!",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800",
    category: "Baking",
    prepTime: "20 hrs",
    cookTime: "4 hrs",
    totalTime: "24 hrs",
    servings: 10,
    author: "BakeMaster Sam",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    rating: 4.8,
    reviewsCount: 94,
    difficulty: "Hard",
    ingredients: [
      { name: "active sourdough starter (fed)", quantity: 350, unit: "g" },
      { name: "bread flour", quantity: 500, unit: "g" },
      { name: "warm water", quantity: 350, unit: "g" },
      { name: "fine sea salt", quantity: 10, unit: "g" }
    ],
    directions: [
      {
        step: 1,
        title: "Autolyse",
        description: "Mix flour and water in a bowl until no dry flour remains. Let rest for 45 minutes to build gluten.",
        timer: 2700,
        timerLabel: "Autolyse Rest"
      },
      {
        step: 2,
        title: "Add Starter & Salt",
        description: "Add starter and salt. Squeeze the dough using your fingers to fully incorporate them. Rest for 30 minutes.",
        timer: 1800,
        timerLabel: "Rest after Mix"
      },
      {
        step: 3,
        title: "Stretch and Fold",
        description: "Perform 4 sets of stretch and folds spaced 30 minutes apart. Rest the dough covered in a warm place between sets.",
        timer: 7200,
        timerLabel: "Stretch & Fold Cycle"
      },
      {
        step: 4,
        title: "Bulk Fermentation",
        description: "Let the dough rise in a warm spot until it has increased in volume by about 50% and feels light and bubbly.",
        timer: 14400,
        timerLabel: "Bulk Rise"
      },
      {
        step: 5,
        title: "Shape",
        description: "Pre-shape into a round, rest for 20 minutes, then do final shaping into a boule or batard. Place in a floured banneton basket.",
        timer: 1200,
        timerLabel: "Bench Rest"
      },
      {
        step: 6,
        title: "Cold Retard & Bake",
        description: "Cover and place in the refrigerator for 12-16 hours. Bake in a preheated Dutch oven at 450°F (230°C) covered for 20 minutes, then uncovered for another 20 minutes.",
        timer: 1200,
        timerLabel: "Covered Bake"
      }
    ],
    nutrition: [
      { name: "Calories", value: "180", dv: "9%" },
      { name: "Protein", value: "6g", dv: "12%" },
      { name: "Carbohydrates", value: "38g", dv: "13%" },
      { name: "Dietary Fiber", value: "2g", dv: "8%" },
      { name: "Fat", value: "0.5g", dv: "1%" },
      { name: "Sodium", value: "240mg", dv: "10%" }
    ],
    reviews: [
      { name: "Mark K.", rating: 5, date: "June 25, 2026", text: "My first sourdough loaf was a complete success thanks to this detailed guide! The crumb is perfect." },
      { name: "Jessica T.", rating: 4, date: "June 20, 2026", text: "Excellent step-by-step instructions. Takes time, but the crust and flavor are absolutely worth it." }
    ]
  },
  r3: {
    id: "r3",
    title: "Spicy Peanut Sesame Noodles",
    description: "Vibrant and flavorful noodles tossed in a rich, spicy, and creamy peanut sauce. A perfect quick dinner option that satisfies peanut cravings in under 15 minutes!",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    category: "Quick & Easy",
    prepTime: "5 mins",
    cookTime: "10 mins",
    totalTime: "15 mins",
    servings: 2,
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 4.7,
    reviewsCount: 215,
    difficulty: "Easy",
    ingredients: [
      { name: "ramen or noodles of choice", quantity: 8, unit: "oz" },
      { name: "creamy peanut butter", quantity: 0.25, unit: "cup" },
      { name: "soy sauce", quantity: 2, unit: "tbsp" },
      { name: "sesame oil", quantity: 1, unit: "tbsp" },
      { name: "rice vinegar", quantity: 1, unit: "tbsp" },
      { name: "honey or maple syrup", quantity: 1, unit: "tbsp" },
      { name: "garlic clove (minced)", quantity: 1, unit: "" },
      { name: "chili oil", quantity: 1, unit: "tsp" },
      { name: "warm water (to thin the sauce)", quantity: 3, unit: "tbsp" },
      { name: "green onion (sliced)", quantity: 1, unit: "stalk" },
      { name: "toasted sesame seeds", quantity: 1, unit: "tsp" }
    ],
    directions: [
      {
        step: 1,
        title: "Cook Noodles",
        description: "Cook noodles according to package instructions. Drain and rinse under cold water.",
        timer: 420,
        timerLabel: "Boil Noodles"
      },
      {
        step: 2,
        title: "Make Peanut Sauce",
        description: "In a bowl, whisk together peanut butter, soy sauce, sesame oil, rice vinegar, honey, garlic, and chili oil until smooth. Add warm water 1 tablespoon at a time until sauce reaches a pourable, creamy consistency.",
        timer: null
      },
      {
        step: 3,
        title: "Toss Noodles",
        description: "Pour the sauce over the noodles and toss to coat evenly.",
        timer: null
      },
      {
        step: 4,
        title: "Garnish and Serve",
        description: "Garnish with sliced green onions and toasted sesame seeds. Serve warm or cold.",
        timer: null
      }
    ],
    nutrition: [
      { name: "Calories", value: "490", dv: "25%" },
      { name: "Protein", value: "14g", dv: "28%" },
      { name: "Carbohydrates", value: "62g", dv: "21%" },
      { name: "Dietary Fiber", value: "4g", dv: "16%" },
      { name: "Fat", value: "22g", dv: "34%" },
      { name: "Sodium", value: "850mg", dv: "37%" }
    ],
    reviews: [
      { name: "Tyler B.", rating: 5, date: "June 26, 2026", text: "Fast, flavorful, and incredibly easy. I added some sautéed broccoli and tofu, and it was perfect." },
      { name: "Alice H.", rating: 4, date: "June 23, 2026", text: "Love this sauce! I doubled the chili oil for extra heat. Ready in 15 minutes as promised." }
    ]
  },
  r4: {
    id: "r4",
    title: "Classic Margherita Pizza",
    description: "An authentic Italian masterpiece. Crispy wood-fired style crust topped with simple san marzano tomato sauce, fresh buffalo mozzarella, aromatic sweet basil leaves, and a drizzle of extra virgin olive oil.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    category: "Gourmet",
    prepTime: "15 mins",
    cookTime: "10 mins",
    totalTime: "25 mins",
    servings: 2,
    author: "Chef Isabella",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 4.9,
    reviewsCount: 147,
    difficulty: "Medium",
    ingredients: [
      { name: "pizza dough ball", quantity: 1, unit: "" },
      { name: "San Marzano canned tomatoes (crushed)", quantity: 0.5, unit: "cup" },
      { name: "fresh mozzarella (sliced)", quantity: 4, unit: "oz" },
      { name: "fresh basil leaves", quantity: 6, unit: "" },
      { name: "extra virgin olive oil", quantity: 1, unit: "tbsp" },
      { name: "sea salt", quantity: null, unit: "to taste" }
    ],
    directions: [
      { step: 1, title: "Preheat Oven", description: "Preheat your oven to its maximum temperature (ideally 500°F/260°C) with a pizza stone inside.", timer: 1800, timerLabel: "Stone Preheating" },
      { step: 2, title: "Roll & Shape Dough", description: "Stretch the pizza dough on a floured surface to form a 12-inch circle. Place on a pizza peel dusted with cornmeal.", timer: null },
      { step: 3, title: "Add Saucing", description: "Spread crushed San Marzano tomatoes evenly over the dough, leaving a 1-inch border. Season with a pinch of sea salt.", timer: null },
      { step: 4, title: "Toppings", description: "Distribute mozzarella slices and fresh basil leaves on top of the sauce. Drizzle with extra virgin olive oil.", timer: null },
      { step: 5, title: "Bake", description: "Slide the pizza onto the preheated stone. Bake for 8-10 minutes until the crust is charred and cheese is bubbly.", timer: 480, timerLabel: "Bake Pizza" }
    ],
    nutrition: [
      { name: "Calories", value: "380", dv: "19%" },
      { name: "Protein", value: "14g", dv: "28%" },
      { name: "Carbohydrates", value: "48g", dv: "16%" },
      { name: "Dietary Fiber", value: "2g", dv: "8%" },
      { name: "Fat", value: "12g", dv: "18%" },
      { name: "Sodium", value: "620mg", dv: "27%" }
    ],
    reviews: [
      { name: "Lucas P.", rating: 5, date: "June 25, 2026", text: "Simple is best! This pizza was delicious, tasted just like Napoli." }
    ]
  },
  r5: {
    id: "r5",
    title: "Decadent Chocolate Lava Cake",
    description: "An indulgent dessert featuring a rich chocolate cake shell containing a hot, luscious, liquid chocolate center. Perfect for dinner parties or late-night chocolate cravings.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800",
    category: "Desserts",
    prepTime: "10 mins",
    cookTime: "10 mins",
    totalTime: "20 mins",
    servings: 2,
    author: "Alex Boulud",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    rating: 4.8,
    reviewsCount: 82,
    difficulty: "Medium",
    ingredients: [
      { name: "high-quality dark chocolate (chopped)", quantity: 4, unit: "oz" },
      { name: "unsalted butter", quantity: 0.25, unit: "cup" },
      { name: "whole eggs", quantity: 1, unit: "" },
      { name: "egg yolk", quantity: 1, unit: "" },
      { name: "powdered sugar", quantity: 0.25, unit: "cup" },
      { name: "all-purpose flour", quantity: 2, unit: "tbsp" }
    ],
    directions: [
      { step: 1, title: "Prep Ramekins", description: "Butter two ramekins generously and dust with cocoa powder to prevent sticking.", timer: null },
      { step: 2, title: "Melt Chocolate & Butter", description: "Melt chopped dark chocolate and butter together in a double boiler or microwave in 20-second bursts. Whisk until smooth.", timer: null },
      { step: 3, title: "Whisk Eggs & Sugar", description: "In a separate bowl, whisk egg, egg yolk, and powdered sugar until light and pale.", timer: null },
      { step: 4, title: "Combine Ingredients", description: "Gently fold the melted chocolate mixture and flour into the egg mixture until just combined. Divide evenly between ramekins.", timer: null },
      { step: 5, title: "Bake", description: "Bake at 425°F (218°C) for 10-12 minutes until the edges are firm but the center still jiggles slightly.", timer: 600, timerLabel: "Bake Cake" }
    ],
    nutrition: [
      { name: "Calories", value: "320", dv: "16%" },
      { name: "Protein", value: "5g", dv: "10%" },
      { name: "Carbohydrates", value: "28g", dv: "9%" },
      { name: "Dietary Fiber", value: "3g", dv: "12%" },
      { name: "Fat", value: "22g", dv: "34%" },
      { name: "Sodium", value: "80mg", dv: "3%" }
    ],
    reviews: [
      { name: "Sophie G.", rating: 5, date: "June 26, 2026", text: "Truly decadent! The middle was perfectly gooey. Will make again." }
    ]
  },
  r6: {
    id: "r6",
    title: "Crunchy Avocado Chickpea Salad",
    description: "A super fresh, vibrant, and protein-rich salad loaded with canned chickpeas, creamy avocado, crisp cucumbers, sweet tomatoes, and a tangy lemon herb dressing.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
    category: "Vegan",
    prepTime: "10 mins",
    cookTime: "0 mins",
    totalTime: "10 mins",
    servings: 2,
    author: "Sarah Green",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 4.6,
    reviewsCount: 68,
    difficulty: "Easy",
    ingredients: [
      { name: "canned chickpeas (rinsed and drained)", quantity: 1, unit: "can" },
      { name: "ripe avocado (diced)", quantity: 1, unit: "" },
      { name: "cucumber (diced)", quantity: 0.5, unit: "cup" },
      { name: "cherry tomatoes (halved)", quantity: 1, unit: "cup" },
      { name: "lemon juice", quantity: 2, unit: "tbsp" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
      { name: "salt and black pepper", quantity: null, unit: "to taste" }
    ],
    directions: [
      { step: 1, title: "Combine Ingredients", description: "In a large mixing bowl, combine the drained chickpeas, cucumber, cherry tomatoes, and diced avocado.", timer: null },
      { step: 2, title: "Dressing", description: "Drizzle with fresh lemon juice and extra virgin olive oil. Toss gently so you do not mash the avocado too much.", timer: null },
      { step: 3, title: "Season", description: "Season with fine sea salt and freshly cracked black pepper. Garnish with chopped parsley if desired.", timer: null }
    ],
    nutrition: [
      { name: "Calories", value: "290", dv: "15%" },
      { name: "Protein", value: "9g", dv: "18%" },
      { name: "Carbohydrates", value: "32g", dv: "11%" },
      { name: "Dietary Fiber", value: "10g", dv: "40%" },
      { name: "Fat", value: "15g", dv: "23%" },
      { name: "Sodium", value: "310mg", dv: "13%" }
    ],
    reviews: [
      { name: "Chloe V.", rating: 5, date: "June 24, 2026", text: "Healthy, fresh, and surprisingly filling! Perfect lunch salad." }
    ]
  },
  r7: {
    id: "r7",
    title: "Vibrant Berry Protein Smoothie Bowl",
    description: "A thick, velvety, and nutritious smoothie bowl loaded with frozen mixed berries, banana, spinach, and high-quality vanilla protein powder, beautifully topped with granola, chia seeds, and fresh fruit.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
    category: "Healthy",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    servings: 1,
    author: "Sarah Green",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 4.7,
    reviewsCount: 112,
    difficulty: "Easy",
    ingredients: [
      { name: "frozen mixed berries", quantity: 1, unit: "cup" },
      { name: "frozen banana (sliced)", quantity: 0.5, unit: "" },
      { name: "almond milk (unsweetened)", quantity: 0.5, unit: "cup" },
      { name: "vanilla protein powder", quantity: 1, unit: "scoop" },
      { name: "granola (for topping)", quantity: 2, unit: "tbsp" },
      { name: "chia seeds", quantity: 1, unit: "tsp" }
    ],
    directions: [
      { step: 1, title: "Blend Ingredients", description: "Add frozen berries, banana, protein powder, and almond milk to a high-speed blender. Blend until thick and smooth, scraping sides as needed.", timer: 60, timerLabel: "Blend Smoothie" },
      { step: 2, title: "Pour & Assemble", description: "Pour the thick smoothie mixture into a serving bowl.", timer: null },
      { step: 3, title: "Garnish", description: "Arrange granola, chia seeds, and extra fresh berries on top in neat lines. Enjoy immediately with a spoon!", timer: null }
    ],
    nutrition: [
      { name: "Calories", value: "310", dv: "16%" },
      { name: "Protein", value: "24g", dv: "48%" },
      { name: "Carbohydrates", value: "42g", dv: "14%" },
      { name: "Dietary Fiber", value: "8g", dv: "32%" },
      { name: "Fat", value: "4g", dv: "6%" },
      { name: "Sodium", value: "190mg", dv: "8%" }
    ],
    reviews: [
      { name: "Nathan S.", rating: 4, date: "June 25, 2026", text: "Great recipe, very thick and delicious. I added peanut butter on top too." }
    ]
  },
  r8: {
    id: "r8",
    title: "Crispy Garlic Baked Salmon",
    description: "Succulent, garlic-herb seasoned salmon fillets baked to perfection with a crispy, golden skin. A healthy and elegant meal packed with omega-3 fatty acids.",
    image: "https://images.unsplash.com/photo-1485921325814-dae248b761b7?auto=format&fit=crop&q=80&w=800",
    category: "Healthy",
    prepTime: "10 mins",
    cookTime: "12 mins",
    totalTime: "22 mins",
    servings: 2,
    author: "Chef Isabella",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 4.9,
    reviewsCount: 153,
    difficulty: "Easy",
    ingredients: [
      { name: "salmon fillets", quantity: 2, unit: "fillets" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
      { name: "garlic cloves (minced)", quantity: 3, unit: "" },
      { name: "fresh lemon juice", quantity: 1, unit: "tbsp" },
      { name: "dried dill and parsley", quantity: 1, unit: "tsp" },
      { name: "salt and pepper", quantity: null, unit: "to taste" }
    ],
    directions: [
      { step: 1, title: "Preheat Oven", description: "Preheat oven to 400°F (204°C). Line a baking sheet with parchment paper.", timer: null },
      { step: 2, title: "Season Salmon", description: "Place salmon fillets skin-side down. Drizzle with olive oil and lemon juice. Rub minced garlic, dill, parsley, salt, and pepper onto the flesh.", timer: null },
      { step: 3, title: "Bake Fillets", description: "Bake for 12-15 minutes until the salmon is flaky and opaque in the center. Serve with lemon wedges.", timer: 720, timerLabel: "Bake Salmon" }
    ],
    nutrition: [
      { name: "Calories", value: "290", dv: "15%" },
      { name: "Protein", value: "34g", dv: "68%" },
      { name: "Carbohydrates", value: "1g", dv: "0%" },
      { name: "Dietary Fiber", value: "0g", dv: "0%" },
      { name: "Fat", value: "16g", dv: "25%" },
      { name: "Sodium", value: "280mg", dv: "12%" }
    ],
    reviews: [
      { name: "Raymond L.", rating: 5, date: "June 26, 2026", text: "Healthy, easy, and absolutely delicious. The salmon remained extremely juicy." }
    ]
  }
};

// Quantity Fraction Formatter
function formatQuantity(qty, currentServings, baseServings) {
  if (qty === null || qty === undefined) return "";
  const scaled = (qty * currentServings) / baseServings;
  if (Number.isInteger(scaled)) return scaled.toString();

  const tolerance = 0.02;
  const fractions = [
    { dec: 0.25, str: "1/4" },
    { dec: 0.33, str: "1/3" },
    { dec: 0.5,  str: "1/2" },
    { dec: 0.66, str: "2/3" },
    { dec: 0.75, str: "3/4" }
  ];

  const decimal = scaled % 1;
  const integer = Math.floor(scaled);

  for (let f of fractions) {
    if (Math.abs(decimal - f.dec) < tolerance) {
      return integer > 0 ? `${integer} ${f.str}` : f.str;
    }
  }
  return scaled.toFixed(1);
}

// Inline Timer Component
const InlineTimer = ({ duration, label }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const toggleTimer = (e) => {
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const resetTimer = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;

  return (
    <div className="inline-flex flex-col mt-3 p-3 bg-neutral-100 dark:bg-zinc-800/80 border border-neutral-200/50 dark:border-zinc-700/50 rounded-2xl w-full max-w-[260px] shadow-sm select-none">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 font-sans">
          {label}
        </span>
        <span className="text-xs font-bold font-mono text-orange-500">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 dark:bg-zinc-755 h-1 rounded-full overflow-hidden mb-2.5">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full"
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
      {/* Controls */}
      <div className="flex justify-end gap-2">
        <button
          onClick={resetTimer}
          className="p-1 rounded-full bg-neutral-250 hover:bg-neutral-300 dark:bg-zinc-700 dark:hover:bg-zinc-650 text-neutral-600 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleTimer}
          className={`p-1 rounded-full text-white transition-all scale-105 active:scale-95 shadow-sm cursor-pointer ${
            isRunning ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
          }`}
          title={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default function RecipeDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id || "r1";
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Servings and interactive states
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      // 1. Check local mock database first
      if (MOCK_RECIPE_DETAILS[id]) {
        const local = MOCK_RECIPE_DETAILS[id];
        setRecipe(local);
        setServings(local.servings || 4);
        setReviews(local.reviews || []);
        setLoading(false);
        return;
      }

      // 2. Fetch from Firestore
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRecipe({
            id: docSnap.id,
            ...data
          });
          setServings(data.servings || 4);
          setReviews(data.reviews || []);
        } else {
          // Fallback to r1 if not found
          const fallback = MOCK_RECIPE_DETAILS.r1;
          setRecipe(fallback);
          setServings(fallback.servings || 4);
          setReviews(fallback.reviews || []);
        }
      } catch (err) {
        console.error("Error fetching recipe from Firestore:", err);
        const fallback = MOCK_RECIPE_DETAILS.r1;
        setRecipe(fallback);
        setServings(fallback.servings || 4);
        setReviews(fallback.reviews || []);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setNewReviewName(currentUser.displayName || currentUser.email.split("@")[0] || "");
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const savedList = userData.savedRecipes || [];
            setSaved(savedList.includes(id));
          }
        } catch (err) {
          console.error("Error fetching user bookmarks:", err);
        }
      } else {
        setSaved(false);
        setNewReviewName("");
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleSaveRecipe = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      const userDocRef = doc(db, "users", user.uid);
      if (nextSaved) {
        await updateDoc(userDocRef, {
          savedRecipes: arrayUnion(id)
        });
      } else {
        await updateDoc(userDocRef, {
          savedRecipes: arrayRemove(id)
        });
      }
    } catch (err) {
      console.error("Error updating bookmarks:", err);
      setSaved(!nextSaved);
    }
  };

  if (loading || !recipe) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-500 dark:text-zinc-400 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-sm font-semibold">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  // Toggle checks
  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Copy share link
  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newComment = {
      name: newReviewName.trim(),
      rating: Number(newReviewRating),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      text: newReviewText.trim(),
    };

    const updatedReviews = [newComment, ...reviews];
    setReviews(updatedReviews);

    const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

    const isMockRecipe = id.startsWith("r") && MOCK_RECIPE_DETAILS[id];
    if (!isMockRecipe) {
      try {
        const docRef = doc(db, "recipes", id);

        await updateDoc(docRef, {
          reviews: updatedReviews,
          rating: avgRating,
          reviewsCount: updatedReviews.length
        });
      } catch (err) {
        console.error("Error saving review to Firestore:", err);
      }
    } else {
      // Persist in-memory during local session
      MOCK_RECIPE_DETAILS[id].reviews = updatedReviews;
      MOCK_RECIPE_DETAILS[id].rating = avgRating;
      MOCK_RECIPE_DETAILS[id].reviewsCount = updatedReviews.length;
    }

    setRecipe(prev => ({
      ...prev,
      reviews: updatedReviews,
      rating: avgRating,
      reviewsCount: updatedReviews.length
    }));

    setNewReviewName(user?.displayName || user?.email.split("@")[0] || "");
    setNewReviewText("");
    setNewReviewRating(5);
    setFormSubmitted(true);

    setTimeout(() => setFormSubmitted(false), 3000);
  };

  // Directions completion percentage
  const totalSteps = recipe.directions.length;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / totalSteps) * 100);

  // Build the Tabs Data
  const tabsData = [
    {
      title: "Ingredients",
      value: "ingredients",
      content: (
        <div className="w-full h-full bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-xl overflow-y-auto max-h-full no-visible-scrollbar">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-100 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-zinc-50 font-sans">
                Ingredients List
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 font-sans">
                Check off items as you gather them.
              </p>
            </div>
            
            {/* Servings Adjuster */}
            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full border border-neutral-200/50 dark:border-zinc-700/50 shrink-0 select-none">
              <span className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 font-sans">
                Servings:
              </span>
              <button
                onClick={() => servings > 1 && setServings(servings - 1)}
                className="w-6 h-6 rounded-full bg-white dark:bg-zinc-700 border border-neutral-200 dark:border-zinc-650 flex items-center justify-center text-neutral-600 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-sm text-neutral-800 dark:text-zinc-100 min-w-[20px] text-center font-sans">
                {servings}
              </span>
              <button
                onClick={() => servings < 24 && setServings(servings + 1)}
                className="w-6 h-6 rounded-full bg-white dark:bg-zinc-700 border border-neutral-200 dark:border-zinc-650 flex items-center justify-center text-neutral-600 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* List of Ingredients */}
          <div className="space-y-3">
            {recipe.ingredients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-205 cursor-pointer ${
                    isChecked
                      ? "bg-orange-50/40 dark:bg-orange-950/10 border-orange-200/50 dark:border-orange-900/30 opacity-70"
                      : "bg-neutral-50/50 dark:bg-zinc-900/30 border-neutral-100 dark:border-zinc-800/40 hover:border-neutral-200 dark:hover:border-zinc-700/60"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 shrink-0 ${
                      isChecked
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-neutral-350 dark:border-zinc-600 bg-white dark:bg-zinc-850"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  {/* Text */}
                  <span
                    className={`text-sm font-medium leading-tight font-sans ${
                      isChecked
                        ? "line-through text-neutral-450 dark:text-zinc-500"
                        : "text-neutral-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="font-bold text-orange-500 mr-1.5 font-sans">
                      {formatQuantity(ing.quantity, servings, recipe.servings)} {ing.unit}
                    </span>
                    {ing.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Directions",
      value: "directions",
      content: (
        <div className="w-full h-full bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-xl overflow-y-auto max-h-full no-visible-scrollbar">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-100 dark:border-zinc-800 pb-4">
            <div>
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-zinc-50 font-sans">
                Directions & Steps
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5 font-sans">
                Check steps to track your cooking progress.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-3 shrink-0 select-none">
              <span className="text-xs font-semibold text-neutral-500 dark:text-zinc-400 font-sans">
                Progress:
              </span>
              <div className="w-32 bg-neutral-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-neutral-200/30 dark:border-zinc-750">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
              </div>
              <span className="text-xs font-bold text-orange-500 min-w-[32px] font-sans">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* List of Steps */}
          <div className="space-y-6">
            {recipe.directions.map((dir, idx) => {
              const isCompleted = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isCompleted
                      ? "bg-orange-50/20 dark:bg-orange-950/5 border-orange-100/30 dark:border-orange-950/20 opacity-60"
                      : "bg-neutral-50/30 dark:bg-zinc-900/10 border-neutral-100 dark:border-zinc-800/40 hover:border-neutral-200 dark:hover:border-zinc-700/50"
                  }`}
                >
                  {/* Step Number Badge */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border font-extrabold text-sm transition-all duration-300 font-sans ${
                      isCompleted
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : dir.step}
                  </div>
                  
                  {/* Step Details */}
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-sm md:text-base font-sans ${
                        isCompleted
                          ? "line-through text-neutral-450 dark:text-zinc-500"
                          : "text-neutral-900 dark:text-zinc-100"
                      }`}
                    >
                      {dir.title}
                    </h4>
                    <p
                      className={`text-xs md:text-sm text-neutral-600 dark:text-zinc-400 mt-1 leading-relaxed font-sans ${
                        isCompleted ? "text-neutral-450 dark:text-zinc-500" : ""
                      }`}
                    >
                      {dir.description}
                    </p>
                    
                    {/* Inline Timer */}
                    {dir.timer && !isCompleted && (
                      <InlineTimer duration={dir.timer} label={dir.timerLabel} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Nutrition & Reviews",
      value: "nutrition-reviews",
      content: (
        <div className="w-full h-full bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-xl overflow-y-auto max-h-full no-visible-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column 1: Nutrition */}
            <div>
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-zinc-50 mb-1 font-sans">
                Nutritional Profile
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mb-6 font-sans">
                Estimated nutrition breakdown per serving.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {recipe.nutrition.map((nut, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-850/50 border border-neutral-100 dark:border-zinc-800/60 flex flex-col justify-between"
                  >
                    <span className="text-xs font-semibold text-neutral-400 dark:text-zinc-550 font-sans">
                      {nut.name}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-xl font-black text-neutral-850 dark:text-zinc-150 font-sans">
                        {nut.value}
                      </span>
                      <span className="text-[10px] font-bold text-orange-500 font-sans">
                        {nut.dv} DV
                      </span>
                    </div>
                    {/* Progress representation */}
                    <div className="w-full bg-neutral-200 dark:bg-zinc-850 h-1 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: nut.dv }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Reviews */}
            <div className="flex flex-col">
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-zinc-50 mb-1 flex items-center gap-2 font-sans">
                <span>Reviews & Feedback</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-neutral-100 dark:bg-zinc-800 rounded-full text-neutral-500 dark:text-zinc-400 font-sans">
                  {reviews.length}
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mb-6 font-sans">
                Hear what other home cooks think about this recipe.
              </p>

              {/* Leave a review form */}
              {user ? (
                <form
                  id="review-form"
                  onSubmit={handleReviewSubmit}
                  className="mb-8 p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-850/40 border border-neutral-250/20 dark:border-zinc-800/80 space-y-4"
                >
                  <h4 className="font-bold text-xs text-neutral-750 dark:text-zinc-300 uppercase tracking-wider font-sans">
                    Write a Review
                  </h4>
                  
                  {/* Star Selector */}
                  <div className="flex items-center gap-1.5 select-none">
                    <span className="text-xs text-neutral-450 dark:text-zinc-550 mr-2 font-sans">Rating:</span>
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isStarred = hoverRating !== null ? val <= hoverRating : val <= newReviewRating;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewReviewRating(val)}
                          onMouseEnter={() => setHoverRating(val)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="text-amber-400 focus:outline-none cursor-pointer transform hover:scale-110 active:scale-95 transition-all"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              isStarred ? "text-amber-500 fill-amber-500" : "text-neutral-200 dark:text-zinc-800"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-250/40 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100 focus:border-orange-500 focus:outline-none transition-colors font-sans"
                    />
                    <textarea
                      required
                      placeholder="Share your experience (did you swap ingredients, adjust heat etc.?)"
                      value={newReviewText}
                      rows={3}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-250/40 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100 focus:border-orange-500 focus:outline-none transition-colors resize-none font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <CustomButton
                      type="submit"
                      variant="primary"
                      className="py-2.5 px-5 text-xs rounded-xl cursor-pointer font-sans"
                    >
                      Submit Review
                    </CustomButton>
                    
                    {/* Toast animation */}
                    <AnimatePresence>
                      {formSubmitted && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs font-semibold text-green-500 flex items-center gap-1 font-sans"
                        >
                          <Check className="w-3.5 h-3.5 animate-bounce" />
                          Review posted!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              ) : (
                <div id="review-form" className="mb-8 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-neutral-800 dark:text-zinc-200 font-sans">
                      Want to rate this recipe?
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-zinc-400 font-sans max-w-sm mx-auto">
                      Sign in to your SavoryCircle account to leave a review and submit your rating.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                  >
                    Sign In to Rate
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-sm flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-neutral-800 dark:text-zinc-200 font-sans">
                        {rev.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-zinc-550 font-sans">
                        {rev.date}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <Star
                          key={val}
                          className={`w-3.5 h-3.5 ${
                            val <= rev.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-neutral-200 dark:text-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed font-sans">
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300 pb-20">
      {/* Floating Navbar */}
      <FloatingNav navItems={NAV_ITEMS} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors mb-6 group cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-250" />
          <span>Back to Recipes</span>
        </Link>

        {/* Recipe Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Details (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 animate-fade-in-up">
            <div>
              {/* Category tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold mb-4 font-sans select-none">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{recipe.category}</span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-tight font-sans">
                {recipe.title}
              </h1>
            </div>

            {/* Author details & Ratings */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 border-b border-neutral-200/50 dark:border-zinc-800 pb-6 select-none">
              <div className="flex items-center gap-2.5">
                <img
                  src={recipe.avatar}
                  alt={recipe.author}
                  className="w-10 h-10 rounded-full object-cover border border-orange-500/20"
                />
                <div>
                  <span className="block text-xs text-neutral-400 dark:text-zinc-500 font-sans">Shared by</span>
                  <span className="font-bold text-sm text-neutral-800 dark:text-zinc-200 font-sans">{recipe.author}</span>
                </div>
              </div>
              <div className="w-px h-6 bg-neutral-200 dark:bg-zinc-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <Star
                      key={val}
                      className={`w-4 h-4 ${
                        val <= Math.floor(recipe.rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-neutral-200 dark:text-zinc-800"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-sm text-neutral-800 dark:text-zinc-250 font-sans">
                  {recipe.rating}
                </span>
                <span className="text-xs text-neutral-400 dark:text-zinc-500 font-sans">
                  ({recipe.reviewsCount || 0} reviews)
                </span>
                <span className="mx-1.5 text-neutral-300 dark:text-zinc-800 hidden sm:inline">•</span>
                <button
                  onClick={() => {
                    const el = document.getElementById("review-form");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors font-sans cursor-pointer underline decoration-dashed underline-offset-4"
                >
                  Rate this recipe
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-neutral-600 dark:text-zinc-400 leading-relaxed font-sans">
              {recipe.description}
            </p>

            {/* Cooking Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/80 shadow-md select-none">
              <div className="text-center p-2">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-zinc-500 font-sans">
                  Prep Time
                </span>
                <span className="text-base font-extrabold text-neutral-850 dark:text-zinc-155 block mt-1 font-sans">
                  {recipe.prepTime}
                </span>
              </div>
              <div className="text-center p-2 border-l border-neutral-100 dark:border-zinc-800/50">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-zinc-500 font-sans">
                  Cook Time
                </span>
                <span className="text-base font-extrabold text-neutral-850 dark:text-zinc-155 block mt-1 font-sans">
                  {recipe.cookTime}
                </span>
              </div>
              <div className="text-center p-2 border-l border-neutral-100 dark:border-zinc-800/50">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-zinc-500 font-sans">
                  Difficulty
                </span>
                <span className={`text-base font-extrabold block mt-1 font-sans ${
                  recipe.difficulty === "Easy" ? "text-green-500" : recipe.difficulty === "Medium" ? "text-orange-500" : "text-red-500"
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
              <div className="text-center p-2 border-l border-neutral-100 dark:border-zinc-800/50">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-zinc-500 font-sans">
                  Total Time
                </span>
                <span className="text-base font-extrabold text-orange-500 block mt-1 font-sans">
                  {recipe.totalTime}
                </span>
              </div>
            </div>

            {/* CTA Interaction buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CustomButton
                variant={saved ? "glow" : "secondary"}
                onClick={handleSaveRecipe}
                className="py-3 px-6 cursor-pointer shrink-0 font-sans"
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                <span>{saved ? "Recipe Saved" : "Save Recipe"}</span>
              </CustomButton>

              <div className="relative">
                <CustomButton
                  variant="secondary"
                  onClick={copyShareLink}
                  className="py-3 px-6 cursor-pointer font-sans"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </CustomButton>
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-900 dark:bg-zinc-800 text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap z-50 pointer-events-none font-sans"
                    >
                      Copied link to clipboard!
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-zinc-800" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Dish Image (Right 5 Cols) */}
          <div className="lg:col-span-5 relative group">
            {/* Visual Backdrops */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl blur-[15px] opacity-20 group-hover:opacity-30 transition duration-300" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 dark:border-zinc-900/60 aspect-[4/3] sm:aspect-square md:aspect-video lg:aspect-square bg-neutral-100 dark:bg-zinc-800 select-none">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Rating float */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-white/20 dark:border-zinc-800/40">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-neutral-800 dark:text-zinc-150 font-sans">
                  {recipe.rating}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium font-sans">
                  ({recipe.reviewsCount})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab section */}
        <div className="max-w-4xl mx-auto mt-20 relative px-2">
          {/* Custom Tabs */}
          <Tabs
            tabs={tabsData}
            containerClassName="mx-auto max-w-xl md:max-w-2xl bg-neutral-50 dark:bg-zinc-900 border border-neutral-200/40 dark:border-zinc-850"
            activeTabClassName="bg-orange-500"
            contentClassName="mt-4"
          />
        </div>
      </main>
    </div>
  );
}
