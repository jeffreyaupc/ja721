import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function StandardNoteArticle({
  title,
  teaser,
  markdown,
}: {
  title: string;
  teaser?: string | null;
  markdown: string;
}) {
  return (
    <article className="standard-note">
      {teaser && <p className="eyebrow">{teaser}</p>}
      <h1>{title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
