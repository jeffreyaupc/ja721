import { CustomNoteRuntime } from "./CustomNoteRuntime";

export function CustomNoteContainer({
  html,
  css,
}: {
  html: string;
  css: string;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div id="custom-note-root" dangerouslySetInnerHTML={{ __html: html }} />
      <CustomNoteRuntime />
    </>
  );
}
