import Homepage from "@/features/homepage/homepage";
import { getCurrentUser } from "@/features/auth/server";

export default async function Home() {
  const user = await getCurrentUser();

  return <Homepage user={user} />;
}

