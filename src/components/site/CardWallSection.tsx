"use client";

import { useMemo, useState } from "react";
import type { Category, Item } from "@/lib/types";
import { FilterNav } from "./FilterNav";
import { CardShell } from "@/components/cards/CardShell";
import { CARD_COMPONENTS } from "@/components/cards/registry";
import { CardAdminControls } from "@/components/editor/CardAdminControls";
import { AddItemButton } from "@/components/editor/AddItemButton";
import { CategoryManagerModal } from "@/components/editor/CategoryManagerModal";

export function CardWallSection({
  items,
  categories,
  isAuthor,
}: {
  items: Item[];
  categories: Category[];
  isAuthor: boolean;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | "all">(
    "all"
  );
  const [managingCategories, setManagingCategories] = useState(false);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories]
  );

  const visibleItems =
    activeCategoryId === "all"
      ? items
      : items.filter((item) => item.category_id === activeCategoryId);

  return (
    <section>
      <FilterNav
        categories={categories}
        activeCategoryId={activeCategoryId}
        onChange={setActiveCategoryId}
      />

      {isAuthor && (
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 px-6 pb-4 sm:px-10">
          <AddItemButton
            categories={categories}
            defaultCategoryId={
              activeCategoryId === "all" ? undefined : activeCategoryId
            }
          />
          <button
            onClick={() => setManagingCategories(true)}
            className="font-mono text-xs uppercase tracking-wide text-ink-faint hover:text-seal"
          >
            管理分類
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl columns-1 gap-6 px-6 pb-20 sm:px-10 md:columns-2 lg:columns-3">
        {visibleItems.map((item, index) => {
          const category = categoryById.get(item.category_id);
          if (!category) return null;
          const CardComponent = CARD_COMPONENTS[category.display_style];
          return (
            <CardShell key={item.id} id={item.id} index={index}>
              <CardComponent item={item} />
              {isAuthor && (
                <CardAdminControls item={item} categories={categories} />
              )}
            </CardShell>
          );
        })}
      </div>

      {managingCategories && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setManagingCategories(false)}
        />
      )}
    </section>
  );
}
