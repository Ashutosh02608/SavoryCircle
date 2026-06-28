import React from "react";
import { Flame, Star, BookOpen, Heart, Award } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Home", link: "/" },
  { name: "Recipes", link: "/recipes" },
  { name: "Categories", link: "/categories" },
  { name: "Creators", link: "/creators" },
  { name: "Stories", link: "/stories" },
];

export const CATEGORIES = [
  {
    title: "Quick & Easy",
    description: "Tasty meals ready in under 30 minutes for busy weekdays.",
    link: "/categories/quick-easy",
  },
  {
    title: "Baking Masterclass",
    description: "From crusty sourdough to decadent chocolate cakes.",
    link: "/categories/baking",
  },
  {
    title: "Vegan & Plant-Based",
    description: "Vibrant, nutritious, and purely delicious plant-based food.",
    link: "/categories/vegan",
  },
  {
    title: "Healthy Eating",
    description: "Wholesome, macro-friendly recipes to fuel your daily life.",
    link: "/categories/healthy",
  },
  {
    title: "Desserts & Treats",
    description: "Sweet indulgences, cookies, and pastries to satisfy your cravings.",
    link: "/categories/desserts",
  },
  {
    title: "Gourmet Dining",
    description: "Restaurant-quality dishes to impress your dinner guests.",
    link: "/categories/gourmet",
  },
];

export const FEATURED_RECIPES = [
  {
    id: "r1",
    title: "Creamy Tuscan Garlic Chicken",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
    category: "Gourmet",
    cookTime: "35 mins",
    rating: 4.9,
    author: "Chef Isabella",
  },
  {
    id: "r2",
    title: "Artisanal Sourdough Bread",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800",
    category: "Baking",
    cookTime: "24 hrs",
    rating: 4.8,
    author: "BakeMaster Sam",
  },
  {
    id: "r3",
    title: "Spicy Peanut Sesame Noodles",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    category: "Quick & Easy",
    cookTime: "15 mins",
    rating: 4.7,
    author: "Elena Rostova",
  },
];

export const CREATORS = [
  {
    name: "Chef Marcus",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150",
    specialty: "Italian Cuisine",
    recipesCount: 142,
    followersCount: "12.8k",
  },
  {
    name: "Sarah Green",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    specialty: "Plant-Based Chef",
    recipesCount: 89,
    followersCount: "9.4k",
  },
  {
    name: "Alex Boulud",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    specialty: "Pastry Specialist",
    recipesCount: 65,
    followersCount: "7.1k",
  },
];
