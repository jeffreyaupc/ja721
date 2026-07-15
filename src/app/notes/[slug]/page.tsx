import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNoteBySlug } from "@/lib/items";
import { getIsAuthor } from "@/lib/auth";
import { CustomNoteContainer } from "@/components/notes/CustomNoteContainer";
import { StandardNoteArticle } from "@/components/notes/StandardNoteArticle";
import { NoteBodyEditor } from "@/components/editor/NoteBodyEditor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNoteBySlug(slug);
  return { title: item?.title ?? "筆記" };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, isAuthor] = await Promise.all([
    getNoteBySlug(slug),
    getIsAuthor(),
  ]);

  if (!item || !item.notes) notFound();
  const note = item.notes;

  return (
    <>
      {note.template === "custom" ? (
        <CustomNoteContainer
          html={note.custom_html ?? ""}
          css={note.custom_css ?? ""}
        />
      ) : (
        <StandardNoteArticle
          title={item.title}
          teaser={item.teaser}
          markdown={note.markdown_body ?? ""}
        />
      )}
      {isAuthor && <NoteBodyEditor item={item} note={note} />}
    </>
  );
}
