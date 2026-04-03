import { getCurrentUser } from "@/features/auth/server";
import RecipesPage from "@/features/recipes/components/recipes-page";

export default async function MyRecipesPage() {
  const user = await getCurrentUser();

  return (
    <RecipesPage
      user={user}
      initialMineOnly
      pageTitle="My Recipes"
      pageDescription="Recipes you have shared with the SavoryCircle community."
    />
  );
}

