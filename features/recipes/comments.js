import { ObjectId } from "mongodb";
import { getDb } from "@/shared/lib/mongodb";

const COMMENT_COLLECTION = "recipeComments";
const RECIPE_COLLECTION = "recipes";

let commentIndexesReady = false;

function normalizeComment(comment) {
  return {
    id: String(comment._id),
    recipeId: String(comment.recipeId),
    authorName: comment.authorName,
    text: comment.text,
    createdAt: comment.createdAt,
  };
}

async function ensureCommentIndexes() {
  if (commentIndexesReady) {
    return;
  }

  const db = await getDb();
  await db.collection(COMMENT_COLLECTION).createIndex({ recipeId: 1, createdAt: -1 });
  commentIndexesReady = true;
}

export async function listRecipeComments(recipeId) {
  await ensureCommentIndexes();

  if (!ObjectId.isValid(recipeId)) {
    return [];
  }

  const db = await getDb();
  const comments = await db
    .collection(COMMENT_COLLECTION)
    .find({ recipeId: new ObjectId(recipeId) })
    .sort({ createdAt: -1 })
    .toArray();

  return comments.map(normalizeComment);
}

export async function createRecipeComment({ recipeId, user, text }) {
  await ensureCommentIndexes();

  if (!user) {
    return { error: "Please sign in to comment.", status: 401 };
  }

  if (!ObjectId.isValid(recipeId)) {
    return { error: "Invalid recipe id.", status: 400 };
  }

  const cleanText = String(text || "").trim();

  if (!cleanText) {
    return { error: "Comment cannot be empty.", status: 422 };
  }

  if (cleanText.length > 500) {
    return { error: "Comment is too long.", status: 422 };
  }

  const db = await getDb();
  const recipeObjectId = new ObjectId(recipeId);

  const recipe = await db
    .collection(RECIPE_COLLECTION)
    .findOne({ _id: recipeObjectId }, { projection: { _id: 1 } });

  if (!recipe) {
    return { error: "Recipe not found.", status: 404 };
  }

  const newComment = {
    recipeId: recipeObjectId,
    userId: new ObjectId(user.id),
    authorName: user.name,
    text: cleanText,
    createdAt: new Date(),
  };

  const result = await db.collection(COMMENT_COLLECTION).insertOne(newComment);

  return {
    comment: normalizeComment({ ...newComment, _id: result.insertedId }),
  };
}

