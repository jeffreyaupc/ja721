import Image from "next/image";
import type { Item } from "@/lib/types";

export function ImageCaptionCard({ item }: { item: Item }) {
  return (
    <div>
      {item.image_url && (
        <div className="relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-sm bg-paper-2">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <h3 className="mb-1 font-serif-tc text-base font-semibold text-ink">
        {item.title}
      </h3>
      {item.teaser && <p className="text-sm text-ink-soft">{item.teaser}</p>}
    </div>
  );
}
