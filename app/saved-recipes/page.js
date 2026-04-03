import { getCurrentUser } from "@/features/auth/server";
import RecipesPage from "@/features/recipes/components/recipes-page";

export default async function SavedRecipesPage() {
  const user = await getCurrentUser();

  return (
    <RecipesPage
      user={user}
      initialSavedOnly
      pageTitle="Saved Recipes"
      pageDescription="These are the recipes you have saved."
    />
  );
}

