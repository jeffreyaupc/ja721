import { getItems, getCategories } from "@/lib/items";
import { getIsAuthor } from "@/lib/auth";
import { CardWallSection } from "@/components/site/CardWallSection";

export default async function HomePage() {
  const [items, categories, isAuthor] = await Promise.all([
    getItems(),
    getCategories(),
    getIsAuthor(),
  ]);

  return (
    <CardWallSection items={items} categories={categories} isAuthor={isAuthor} />
  );
}
