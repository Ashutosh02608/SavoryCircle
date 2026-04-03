import { getCurrentUser } from "@/features/auth/server";
import RecipesPage from "@/features/recipes/components/recipes-page";

function isTruthy(value) {
  if (typeof value !== "string") {
    return false;
  }

  return value === "1" || value.toLowerCase() === "true";
}


export default async function RecipesRoute({ searchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const initialQuery = typeof params?.q === "string" ? params.q : "";
  const initialCategory = typeof params?.category === "string" ? params.category : "All";
  const initialCreator = typeof params?.creator === "string" ? params.creator : "All";
  const initialSavedOnly = isTruthy(params?.saved);
  const initialMineOnly = isTruthy(params?.mine);

  return (
    <RecipesPage
      user={user}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
      initialCreator={initialCreator}
      initialSavedOnly={initialSavedOnly}
      initialMineOnly={initialMineOnly}
      pageTitle="All Recipes"
      pageDescription="Search, sort, and filter recipes to find exactly what you want to cook."
    />
  );
}

