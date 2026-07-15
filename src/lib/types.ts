export type DisplayStyle =
  | "teaser_reveal"
  | "full_text"
  | "image_caption"
  | "audio_player"
  | "tag_list"
  | "note_page";

export type SongKind = "original" | "cover";
export type NoteTemplate = "custom" | "standard";

export interface Category {
  id: string;
  slug: string;
  label: string;
  display_style: DisplayStyle;
  is_builtin: boolean;
  sort_order: number;
  created_at: string;
}

export interface Note {
  item_id: string;
  slug: string;
  template: NoteTemplate;
  markdown_body: string | null;
  custom_html: string | null;
  custom_css: string | null;
  updated_at: string;
}

export interface Item {
  id: string;
  category_id: string;
  title: string;
  teaser: string | null;
  body: string | null;
  image_url: string | null;
  audio_url: string | null;
  song_kind: SongKind | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
  notes: Note | null;
}

export interface SiteSettings {
  eyebrow: string;
  title: string;
  motto: string;
  intro: string;
  seal_text: string;
  footer_text: string;
}
