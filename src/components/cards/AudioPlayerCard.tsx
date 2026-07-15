import type { Item } from "@/lib/types";

export function AudioPlayerCard({ item }: { item: Item }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-serif-tc text-base font-semibold text-ink">
          {item.title}
        </h3>
        {item.song_kind && (
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
              item.song_kind === "original"
                ? "bg-seal/10 text-seal"
                : "bg-moss/10 text-moss"
            }`}
          >
            {item.song_kind === "original" ? "Original" : "Cover"}
          </span>
        )}
      </div>
      {item.teaser && (
        <p className="mb-3 text-sm text-ink-soft">{item.teaser}</p>
      )}
      {item.audio_url && (
        <audio controls className="w-full" src={item.audio_url}>
          您的瀏覽器不支援音訊播放。
        </audio>
      )}
    </div>
  );
}
