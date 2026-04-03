import { ObjectId } from "mongodb";
import { getDb } from "@/shared/lib/mongodb";

const STORY_COLLECTION = "stories";

let storyIndexesReady = false;

function normalizeStory(story) {
  return {
    id: String(story._id),
    authorName: story.authorName || "Community Cook",
    title: story.title,
    content: story.content,
    createdAt: story.createdAt,
  };
}

async function ensureStoryIndexes() {
  if (storyIndexesReady) {
    return;
  }

  const db = await getDb();
  await Promise.all([
    db.collection(STORY_COLLECTION).createIndex({ createdAt: -1 }),
    db.collection(STORY_COLLECTION).createIndex({ userId: 1, createdAt: -1 }),
  ]);

  storyIndexesReady = true;
}

export async function listStories({ limit = 30 } = {}) {
  await ensureStoryIndexes();

  const db = await getDb();
  const stories = await db
    .collection(STORY_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(Math.max(1, Math.min(100, Number(limit) || 30)))
    .toArray();

  return stories.map(normalizeStory);
}

export async function createStory({ user, payload }) {
  await ensureStoryIndexes();

  if (!user) {
    return { error: "Please sign in to write a story.", status: 401 };
  }

  const title = String(payload?.title || "").trim();
  const content = String(payload?.content || "").trim();

  if (title.length < 3 || title.length > 120) {
    return { error: "Title must be between 3 and 120 characters.", status: 422 };
  }

  if (content.length < 20 || content.length > 2000) {
    return { error: "Story must be between 20 and 2000 characters.", status: 422 };
  }

  const db = await getDb();
  const doc = {
    userId: new ObjectId(user.id),
    authorName: user.name || "Community Cook",
    title,
    content,
    createdAt: new Date(),
  };

  const result = await db.collection(STORY_COLLECTION).insertOne(doc);

  return {
    story: normalizeStory({ ...doc, _id: result.insertedId }),
  };
}
