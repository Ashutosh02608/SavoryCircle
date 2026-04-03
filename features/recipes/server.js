import { ObjectId } from "mongodb";
import { getDb } from "@/shared/lib/mongodb";

const RECIPE_COLLECTION = "recipes";
const SAVED_COLLECTION = "savedRecipes";
const RATING_COLLECTION = "recipeRatings";

const DEFAULT_RECIPES = [
  {
    title: "Lemon Garlic Salmon",
    category: "Seafood",
    difficulty: "Easy",
    cookTime: 22,
    rating: 4.8,
    ratingCount: 0,
    popularity: 1820,
    ingredients: ["salmon", "lemon", "garlic", "butter"],
    description: "Pan-seared salmon with bright lemon garlic butter sauce.",
    content:
      "Season salmon with salt and pepper. Sear skin-side down until crisp, flip and cook through. Add butter, minced garlic, and lemon juice to the pan, spoon the sauce over the fish, and finish with parsley.",
    authorName: "Community Kitchen",
    authorId: null,
  },
  {
    title: "Creamy Mushroom Pasta",
    category: "Italian",
    difficulty: "Medium",
    cookTime: 30,
    rating: 4.7,
    ratingCount: 0,
    popularity: 2110,
    ingredients: ["pasta", "mushroom", "cream", "parmesan"],
    description: "Velvety mushroom cream sauce tossed with al dente pasta.",
    content:
      "Saute mushrooms until golden. Add garlic, then deglaze with a splash of pasta water. Stir in cream and parmesan until silky. Toss with cooked pasta and black pepper, then serve hot.",
    authorName: "Community Kitchen",
    authorId: null,
  },
  {
    title: "Spicy Chickpea Tacos",
    category: "Quick",
    difficulty: "Easy",
    cookTime: 18,
    rating: 4.6,
    ratingCount: 0,
    popularity: 1695,
    ingredients: ["chickpeas", "tortilla", "lime", "chili"],
    description: "Fast vegetarian tacos with smoky chickpeas and crunchy slaw.",
    content:
      "Saute chickpeas with chili powder, cumin, and smoked paprika. Warm tortillas, fill with chickpeas and slaw, and finish with lime juice and cilantro.",
    authorName: "Community Kitchen",
    authorId: null,
  },
  {
    title: "Chocolate Banana Pancakes",
    category: "Brunch",
    difficulty: "Easy",
    cookTime: 20,
    rating: 4.9,
    ratingCount: 0,
    popularity: 2350,
    ingredients: ["banana", "cocoa", "flour", "milk"],
    description: "Fluffy cocoa pancakes with sweet banana in every bite.",
    content:
      "Mash ripe banana and whisk with milk, egg, and vanilla. Fold in flour, cocoa, and baking powder. Cook pancakes on a buttered skillet until bubbles form, flip, and serve with maple syrup.",
    authorName: "Community Kitchen",
    authorId: null,
  },
];

const LEGACY_SAMPLE_TITLES = new Set([
  "Fire-Roasted Shakshuka",
  "Citrus Garden Bowl",
  "Wood-Fired Burrata Pizza",
  "Crispy Chili Tofu Wraps",
  "Smoky Butter Chicken",
  "Green Goddess Orzo",
  "Caramelized Onion Tart",
  "Rosemary Tomato Pasta",
]);

const DEFAULT_RECIPE_IMAGES = {
  "Lemon Garlic Salmon":
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  "Creamy Mushroom Pasta":
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
  "Spicy Chickpea Tacos":
    "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80",
  "Chocolate Banana Pancakes":
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
};

let indexesReady = false;

function getRecipeImageFromTitle(title) {
  const normalizedTitle = String(title || "").trim();
  const knownImage = DEFAULT_RECIPE_IMAGES[normalizedTitle];

  if (knownImage) {
    return knownImage;
  }
  const seed = String(title || "food recipe")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const query = encodeURIComponent(`food,${seed || "recipe"}`);

  return `https://loremflickr.com/1200/720/${query}`;
}

function normalizeRecipe(recipe, savedIds = new Set(), currentUserId = null) {
  const id = String(recipe._id);
  const ownerId = recipe.authorId ? String(recipe.authorId) : null;
  const normalizedTitle = String(recipe.title || "Recipe");
  const storedImageUrl =
    typeof recipe.imageUrl === "string" ? recipe.imageUrl.trim() : "";
  const isUploadedImage = storedImageUrl.startsWith("data:image/");

  return {
    id,
    title: normalizedTitle,
    category: recipe.category,
    difficulty: recipe.difficulty,
    cookTime: Number(recipe.cookTime ?? 0),
    rating: Number(recipe.rating ?? 0),
    ratingCount: Number(recipe.ratingCount ?? 0),
    userRating:
      typeof recipe.userRating === "number" && Number.isFinite(recipe.userRating)
        ? recipe.userRating
        : null,
    popularity: Number(recipe.popularity ?? 0),
    imageUrl: isUploadedImage ? storedImageUrl : getRecipeImageFromTitle(normalizedTitle),
    ingredients: recipe.ingredients || [],
    description: recipe.description,
    content: recipe.content,
    authorName: recipe.authorName || "Community Kitchen",
    createdAt: recipe.createdAt,
    isSaved: savedIds.has(id),
    isMine: Boolean(currentUserId && ownerId && currentUserId === ownerId),
  };
}

function isValidRecipeImageUrl(value) {
  if (!value) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("data:image/")) {
    return false;
  }

  return trimmed.length <= 3_000_000;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSort(sortBy) {
  if (sortBy === "quick") {
    return { cookTime: 1, createdAt: -1 };
  }

  if (sortBy === "rating") {
    return { rating: -1, ratingCount: -1, popularity: -1 };
  }

  if (sortBy === "name") {
    return { title: 1 };
  }

  return { popularity: -1, createdAt: -1 };
}

async function ensureRecipeIndexes() {
  if (indexesReady) {
    return;
  }

  const db = await getDb();

  await Promise.all([
    db.collection(RECIPE_COLLECTION).createIndex({ createdAt: -1 }),
    db.collection(RECIPE_COLLECTION).createIndex({ title: 1 }),
    db.collection(RECIPE_COLLECTION).createIndex({ category: 1 }),
    db.collection(RECIPE_COLLECTION).createIndex({ authorId: 1 }),
    db.collection(RECIPE_COLLECTION).createIndex({ rating: -1, ratingCount: -1 }),
    db
      .collection(SAVED_COLLECTION)
      .createIndex({ userId: 1, recipeId: 1 }, { unique: true }),
    db.collection(SAVED_COLLECTION).createIndex({ userId: 1, createdAt: -1 }),
    db
      .collection(RATING_COLLECTION)
      .createIndex({ userId: 1, recipeId: 1 }, { unique: true }),
    db.collection(RATING_COLLECTION).createIndex({ recipeId: 1, updatedAt: -1 }),
  ]);

  const recipes = db.collection(RECIPE_COLLECTION);

  await recipes.deleteMany({
    authorId: null,
    title: { $in: Array.from(LEGACY_SAMPLE_TITLES) },
  });

  const duplicateGroups = await recipes
    .aggregate([
      { $match: { authorId: null } },
      { $sort: { createdAt: -1, _id: -1 } },
      {
        $group: {
          _id: "$title",
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  const duplicateIdsToDelete = duplicateGroups.flatMap((group) => group.ids.slice(1));

  if (duplicateIdsToDelete.length > 0) {
    await recipes.deleteMany({ _id: { $in: duplicateIdsToDelete } });
  }

  const existing = await recipes.find({}, { projection: { title: 1 } }).toArray();
  const existingTitles = new Set(existing.map((item) => item.title));

  const missingDefaults = DEFAULT_RECIPES.filter((recipe) => !existingTitles.has(recipe.title)).map(
    (recipe) => ({
      ...recipe,
      createdAt: new Date(),
    })
  );

  if (missingDefaults.length > 0) {
    await recipes.insertMany(missingDefaults);
  }

  await recipes.updateMany(
    { ratingCount: { $exists: false } },
    { $set: { ratingCount: 0 } }
  );

  indexesReady = true;
}

async function getSavedIdSet(userId) {
  if (!userId) {
    return new Set();
  }

  const db = await getDb();
  const saved = await db
    .collection(SAVED_COLLECTION)
    .find({ userId: new ObjectId(userId) }, { projection: { recipeId: 1 } })
    .toArray();

  return new Set(saved.map((item) => String(item.recipeId)));
}

async function getUserRatingForRecipe({ db, userId, recipeObjectId }) {
  if (!userId) {
    return null;
  }

  const ratingDoc = await db.collection(RATING_COLLECTION).findOne(
    {
      userId: new ObjectId(userId),
      recipeId: recipeObjectId,
    },
    { projection: { value: 1 } }
  );

  return ratingDoc ? Number(ratingDoc.value) : null;
}

async function recalculateRecipeRating({ db, recipeObjectId }) {
  const [aggregate] = await db
    .collection(RATING_COLLECTION)
    .aggregate([
      { $match: { recipeId: recipeObjectId } },
      {
        $group: {
          _id: "$recipeId",
          averageRating: { $avg: "$value" },
          ratingCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const ratingCount = Number(aggregate?.ratingCount ?? 0);
  const rating = ratingCount > 0 ? Number(Number(aggregate.averageRating).toFixed(1)) : 0;

  await db.collection(RECIPE_COLLECTION).updateOne(
    { _id: recipeObjectId },
    {
      $set: {
        rating,
        ratingCount,
      },
    }
  );

  return { rating, ratingCount };
}

export async function listRecipes({
  userId,
  query,
  category,
  creator,
  difficulty,
  sortBy,
  mineOnly,
  savedOnly,
}) {
  await ensureRecipeIndexes();

  const db = await getDb();
  const recipes = db.collection(RECIPE_COLLECTION);

  const filter = {};

  if (query) {
    const regex = new RegExp(escapeRegExp(query), "i");
    filter.$or = [{ title: regex }, { description: regex }, { ingredients: regex }];
  }

  if (category && category !== "All") {
    filter.category = category;
  }

  if (creator && creator !== "All") {
    filter.authorName = creator;
  }

  if (difficulty && difficulty !== "All") {
    filter.difficulty = difficulty;
  }

  if (mineOnly) {
    if (!userId) {
      return [];
    }

    filter.authorId = new ObjectId(userId);
  }

  const savedIds = await getSavedIdSet(userId);

  if (savedOnly) {
    if (!userId || savedIds.size === 0) {
      return [];
    }

    filter._id = { $in: Array.from(savedIds).map((id) => new ObjectId(id)) };
  }

  const items = await recipes.find(filter).sort(getSort(sortBy)).toArray();

  return items.map((recipe) => normalizeRecipe(recipe, savedIds, userId));
}

export async function getRecipeById(recipeId, userId) {
  await ensureRecipeIndexes();

  if (!ObjectId.isValid(recipeId)) {
    return null;
  }

  const db = await getDb();
  const recipeObjectId = new ObjectId(recipeId);
  const recipe = await db.collection(RECIPE_COLLECTION).findOne({ _id: recipeObjectId });

  if (!recipe) {
    return null;
  }

  const savedIds = await getSavedIdSet(userId);
  const userRating = await getUserRatingForRecipe({ db, userId, recipeObjectId });

  return normalizeRecipe({ ...recipe, userRating }, savedIds, userId);
}

export async function createRecipe({ userId, userName, payload }) {
  await ensureRecipeIndexes();

  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  const title = String(payload?.title || "").trim();
  const description = String(payload?.description || "").trim();
  const content = String(payload?.content || "").trim();
  const category = String(payload?.category || "").trim();
  const difficulty = String(payload?.difficulty || "").trim();
  const cookTime = Number(payload?.cookTime);
  const ingredients = Array.isArray(payload?.ingredients)
    ? payload.ingredients
    : String(payload?.ingredients || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const imageUrl = String(payload?.imageUrl || "").trim();

  if (!title || !description || !content || !category || !difficulty || !cookTime) {
    return { error: "Please complete all required fields.", status: 422 };
  }

  if (!isValidRecipeImageUrl(imageUrl)) {
    return { error: "Please upload a valid image under 2 MB.", status: 422 };
  }

  const finalImageUrl = imageUrl || getRecipeImageFromTitle(title);

  const db = await getDb();
  const doc = {
    title,
    description,
    content,
    category,
    difficulty,
    cookTime,
    ingredients,
    rating: 0,
    ratingCount: 0,
    popularity: 0,
    imageUrl: finalImageUrl,
    authorName: userName || "Anonymous Cook",
    authorId: new ObjectId(userId),
    createdAt: new Date(),
  };

  const result = await db.collection(RECIPE_COLLECTION).insertOne(doc);

  return { recipeId: String(result.insertedId) };
}

export async function toggleSavedRecipe({ userId, recipeId }) {
  await ensureRecipeIndexes();

  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  if (!ObjectId.isValid(recipeId)) {
    return { error: "Invalid recipe id.", status: 400 };
  }

  const db = await getDb();
  const recipeObjectId = new ObjectId(recipeId);
  const userObjectId = new ObjectId(userId);

  const recipeExists = await db
    .collection(RECIPE_COLLECTION)
    .findOne({ _id: recipeObjectId }, { projection: { _id: 1 } });

  if (!recipeExists) {
    return { error: "Recipe not found.", status: 404 };
  }

  const existing = await db
    .collection(SAVED_COLLECTION)
    .findOne({ userId: userObjectId, recipeId: recipeObjectId });

  if (existing) {
    await db
      .collection(SAVED_COLLECTION)
      .deleteOne({ userId: userObjectId, recipeId: recipeObjectId });

    return { saved: false };
  }

  await db.collection(SAVED_COLLECTION).insertOne({
    userId: userObjectId,
    recipeId: recipeObjectId,
    createdAt: new Date(),
  });

  return { saved: true };
}

export async function rateRecipe({ userId, recipeId, value }) {
  await ensureRecipeIndexes();

  if (!userId) {
    return { error: "Please sign in to rate recipes.", status: 401 };
  }

  if (!ObjectId.isValid(recipeId)) {
    return { error: "Invalid recipe id.", status: 400 };
  }

  const numericValue = Number(value);
  const roundedValue = Math.round(numericValue);

  if (!Number.isFinite(numericValue) || roundedValue < 1 || roundedValue > 5) {
    return { error: "Rating must be between 1 and 5.", status: 422 };
  }

  const db = await getDb();
  const recipeObjectId = new ObjectId(recipeId);
  const userObjectId = new ObjectId(userId);

  const recipeExists = await db
    .collection(RECIPE_COLLECTION)
    .findOne({ _id: recipeObjectId }, { projection: { _id: 1 } });

  if (!recipeExists) {
    return { error: "Recipe not found.", status: 404 };
  }

  await db.collection(RATING_COLLECTION).updateOne(
    {
      userId: userObjectId,
      recipeId: recipeObjectId,
    },
    {
      $set: {
        value: roundedValue,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  const summary = await recalculateRecipeRating({ db, recipeObjectId });

  return {
    rating: summary.rating,
    ratingCount: summary.ratingCount,
    userRating: roundedValue,
  };
}


