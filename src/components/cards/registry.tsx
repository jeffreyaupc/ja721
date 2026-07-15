import type { ComponentType } from "react";
import type { DisplayStyle, Item } from "@/lib/types";
import { TeaserRevealCard } from "./TeaserRevealCard";
import { NotePageCard } from "./NotePageCard";
import { FullTextCard } from "./FullTextCard";
import { ImageCaptionCard } from "./ImageCaptionCard";
import { AudioPlayerCard } from "./AudioPlayerCard";
import { TagListCard } from "./TagListCard";

export const CARD_COMPONENTS: Record<DisplayStyle, ComponentType<{ item: Item }>> = {
  teaser_reveal: TeaserRevealCard,
  note_page: NotePageCard,
  full_text: FullTextCard,
  image_caption: ImageCaptionCard,
  audio_player: AudioPlayerCard,
  tag_list: TagListCard,
};
