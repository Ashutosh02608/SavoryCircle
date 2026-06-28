"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { NAV_ITEMS } from "@/lib/constants";
import { 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Flame, 
  ChevronRight, 
  BookOpen, 
  Image as ImageIcon,
  PlusCircle,
  HelpCircle,
  FileText,
  Utensils
} from "lucide-react";

export default function AddRecipePage() {
  const router = useRouter();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Quick & Easy");
  const [difficulty, setDifficulty] = useState("Easy");
  const [servings, setServings] = useState(4);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(20);
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" }
  ]);
  const [directions, setDirections] = useState([
    { title: "Preparation", description: "", timer: "" }
  ]);
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Ingredients handlers
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length === 1) return;
    const list = [...ingredients];
    list.splice(index, 1);
    setIngredients(list);
  };

  const handleIngredientChange = (index, field, value) => {
    const list = [...ingredients];
    list[index][field] = value;
    setIngredients(list);
  };

  // Directions handlers
  const handleAddDirection = () => {
    setDirections([...directions, { title: `Step ${directions.length + 1}`, description: "", timer: "" }]);
  };

  const handleRemoveDirection = (index) => {
    if (directions.length === 1) return;
    const list = [...directions];
    list.splice(index, 1);
    // Re-adjust step titles if they are defaults
    const updated = list.map((dir, idx) => ({
      ...dir,
      title: dir.title.startsWith("Step ") ? `Step ${idx + 1}` : dir.title
    }));
    setDirections(updated);
  };

  const handleDirectionChange = (index, field, value) => {
    const list = [...directions];
    list[index][field] = value;
    setDirections(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim() || title.length < 3) {
      newErrors.title = "Recipe title must be at least 3 characters";
    }
    if (!description.trim() || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (!image.trim()) {
      newErrors.image = "Recipe image URL is required";
    } else if (!/^https?:\/\/.+/.test(image)) {
      newErrors.image = "Please enter a valid image URL starting with http:// or https://";
    }
    if (servings <= 0) {
      newErrors.servings = "Servings must be a positive number";
    }
    if (prepTime < 0) {
      newErrors.prepTime = "Prep time cannot be negative";
    }
    if (cookTime < 0) {
      newErrors.cookTime = "Cook time cannot be negative";
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    const validDirections = directions.filter(dir => dir.description.trim());
    if (validDirections.length === 0) {
      newErrors.directions = "At least one step description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const authorName = user.displayName || user.email.split("@")[0];
      const authorAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}`;

      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        prepTime: `${prepTime} mins`,
        cookTime: `${cookTime} mins`,
        totalTime: `${Number(prepTime) + Number(cookTime)} mins`,
        servings: Number(servings),
        image: image.trim(),
        ingredients: validIngredients.map(ing => ({
          name: ing.name.trim(),
          quantity: ing.quantity ? Number(ing.quantity) : null,
          unit: ing.unit.trim()
        })),
        directions: validDirections.map((dir, idx) => ({
          step: idx + 1,
          title: dir.title.trim() || `Step ${idx + 1}`,
          description: dir.description.trim(),
          timer: dir.timer ? Number(dir.timer) * 60 : null // Store as seconds for countdown timers
        })),
        nutrition: [
          { name: "Calories", value: calories.trim() || "0", dv: "0%" },
          { name: "Protein", value: protein.trim() ? `${protein.trim()}g` : "0g", dv: "0%" },
          { name: "Carbohydrates", value: carbs.trim() ? `${carbs.trim()}g` : "0g", dv: "0%" },
          { name: "Fat", value: fat.trim() ? `${fat.trim()}g` : "0g", dv: "0%" }
        ],
        reviews: [],
        rating: 5.0,
        reviewsCount: 0,
        author: authorName,
        avatar: authorAvatar,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      alert("Recipe shared successfully!");
      router.push(`/recipes/${docRef.id}`);
    } catch (err) {
      console.error("Error writing recipe to Firestore:", err);
      setErrors({ form: "Failed to save recipe. Please check your database rules and try again." });
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-sm font-semibold text-neutral-500 dark:text-zinc-400">Checking auth session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col justify-between">
        <FloatingNav navItems={NAV_ITEMS} />
        <main className="max-w-md mx-auto px-4 pt-40 pb-20 w-full flex-1 flex items-center justify-center">
          <div className="w-full relative rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight font-sans">Authentication Required</h2>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 font-sans leading-relaxed">
                You must be logged in to share your own recipes. Sign in to join our culinary community!
              </p>
            </div>
            <CustomButton 
              variant="glow" 
              onClick={() => router.push("/login")}
              className="w-full py-3"
            >
              <span>Go to Login Page</span>
              <ChevronRight className="w-4 h-4" />
            </CustomButton>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-neutral-900 dark:text-zinc-50 transition-colors duration-300">
      <FloatingNav navItems={NAV_ITEMS} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
        {/* Header section */}
        <section className="mb-12 text-center md:text-left relative py-8 px-6 rounded-3xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-neutral-200/40 dark:border-zinc-800/40 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold font-sans">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Share Your Recipe</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-zinc-100 font-sans leading-tight">
              Create a Culinary Masterpiece
            </h1>
            <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Fill in the details below to publish your signature recipe. Home cooks around the world can view your creation, track timers, and leave reviews.
            </p>
          </div>
        </section>

        {errors.form && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-semibold text-center select-none max-w-4xl mx-auto">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Fields (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Card 1: General Details */}
            <div className="rounded-3xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100 dark:border-zinc-800">
                <FileText className="w-5 h-5 text-orange-500" />
                <h2 className="font-extrabold text-xl font-sans">1. General Information</h2>
              </div>

              <Input
                label="Recipe Title"
                placeholder="e.g., Creamy Garlic Butter Shrimp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
                required
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                  Recipe Description
                </label>
                <textarea
                  placeholder="Describe your dish. What does it taste like? What makes it special?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 placeholder-neutral-400 dark:placeholder-zinc-600 text-sm rounded-2xl border border-neutral-200 dark:border-zinc-800 py-3 px-4 transition-all duration-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 ${
                    errors.description ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                  required
                />
                {errors.description && (
                  <span className="text-xs text-red-500 font-medium pl-2">{errors.description}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 text-sm rounded-full border border-neutral-200 dark:border-zinc-800 py-3 px-4 transition-all focus:outline-none focus:border-orange-500"
                  >
                    <option>Quick & Easy</option>
                    <option>Baking</option>
                    <option>Vegan</option>
                    <option>Healthy</option>
                    <option>Desserts</option>
                    <option>Gourmet</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 text-sm rounded-full border border-neutral-200 dark:border-zinc-800 py-3 px-4 transition-all focus:outline-none focus:border-orange-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Servings"
                  type="number"
                  placeholder="4"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  error={errors.servings}
                  required
                />

                <Input
                  label="Prep Time (mins)"
                  type="number"
                  placeholder="15"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  error={errors.prepTime}
                  required
                />

                <Input
                  label="Cook Time (mins)"
                  type="number"
                  placeholder="20"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  error={errors.cookTime}
                  required
                />
              </div>

              <Input
                label="Recipe Image URL"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                icon={<ImageIcon />}
                error={errors.image}
                required
              />
            </div>

            {/* Card 2: Ingredients */}
            <div className="rounded-3xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <Utensils className="w-5 h-5 text-orange-500" />
                  <h2 className="font-extrabold text-xl font-sans">2. Ingredients</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer select-none bg-orange-500/5 px-3.5 py-1.5 rounded-full border border-orange-500/10"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Ingredient</span>
                </button>
              </div>

              {errors.ingredients && (
                <span className="text-xs text-red-500 font-medium pl-1 block">{errors.ingredients}</span>
              )}

              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Ingredient name (e.g., Raw Shrimp)"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                      className="flex-1 bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 text-sm py-2.5 px-4 rounded-full focus:outline-none focus:border-orange-500 font-sans"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      step="any"
                      min="0"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                      className="w-20 bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 text-sm py-2.5 px-4 rounded-full text-center focus:outline-none focus:border-orange-500 font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g. g, cup)"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                      className="w-32 bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 text-sm py-2.5 px-4 rounded-full text-center focus:outline-none focus:border-orange-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className={`p-2.5 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer select-none rounded-full bg-neutral-50 hover:bg-red-50 dark:bg-zinc-950 dark:hover:bg-red-950/20 ${
                        ingredients.length === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Directions / Steps */}
            <div className="rounded-3xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <h2 className="font-extrabold text-xl font-sans">3. Directions & Steps</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddDirection}
                  className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer select-none bg-orange-500/5 px-3.5 py-1.5 rounded-full border border-orange-500/10"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              {errors.directions && (
                <span className="text-xs text-red-500 font-medium pl-1 block">{errors.directions}</span>
              )}

              <div className="space-y-6">
                {directions.map((step, index) => (
                  <div key={index} className="relative p-5 rounded-2xl bg-neutral-50/60 dark:bg-zinc-900/40 border border-neutral-200/40 dark:border-zinc-800/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-extrabold font-sans">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Step title (e.g., Sear Shrimp)"
                          value={step.title}
                          onChange={(e) => handleDirectionChange(index, "title", e.target.value)}
                          className="bg-transparent font-extrabold text-sm text-neutral-850 dark:text-zinc-150 border-b border-transparent focus:border-orange-500 focus:outline-none pb-0.5 px-1 font-sans"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDirection(index)}
                        className={`p-2 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer select-none rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 ${
                          directions.length === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      placeholder="Explain exactly what to do in this step..."
                      value={step.description}
                      onChange={(e) => handleDirectionChange(index, "description", e.target.value)}
                      rows={3}
                      className="w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 placeholder-neutral-400 dark:placeholder-zinc-600 text-sm rounded-xl border border-neutral-200 dark:border-zinc-800/80 py-2.5 px-3.5 focus:outline-none focus:border-orange-500 font-sans"
                      required
                    />

                    <div className="flex items-center gap-2 w-48">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <input
                        type="number"
                        placeholder="Timer (mins)"
                        min="0"
                        value={step.timer}
                        onChange={(e) => handleDirectionChange(index, "timer", e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 placeholder-neutral-400 dark:placeholder-zinc-600 text-xs rounded-full border border-neutral-200 dark:border-zinc-800 py-1.5 px-3 focus:outline-none focus:border-orange-500 text-center font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Nutrition facts */}
            <div className="rounded-3xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100 dark:border-zinc-800">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h2 className="font-extrabold text-xl font-sans">4. Nutritional Info (Optional)</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="Calories"
                  placeholder="e.g. 420"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
                
                <Input
                  label="Protein (g)"
                  placeholder="e.g. 35"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />

                <Input
                  label="Carbohydrates (g)"
                  placeholder="e.g. 8"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />

                <Input
                  label="Fat (g)"
                  placeholder="e.g. 28"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>

            <CustomButton
              variant="glow"
              type="submit"
              className="w-full py-4 text-base font-bold shadow-lg cursor-pointer"
              disabled={loading}
            >
              <span>{loading ? "Publishing Recipe..." : "Publish Signature Recipe"}</span>
            </CustomButton>
          </div>

          {/* Recipe Card Preview (Right Column) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 select-none">
            <div className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
              Live Recipe Card Preview
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl blur-[15px] opacity-10 group-hover:opacity-20 transition duration-300" />
              <RecipeCard
                title={title.trim() || "Your Recipe Title"}
                image={image.trim() || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"}
                category={category}
                cookTime={`${Number(prepTime || 0) + Number(cookTime || 0)} mins`}
                rating={5.0}
                author={user.displayName || user.email.split("@")[0]}
                id="preview"
                className="relative bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 shadow-xl rounded-3xl"
              />
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
