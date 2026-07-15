import "./notes.css";

export default function NoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- intentional: this route deliberately skips next/font so stored custom_css (literal `font-family: 'Noto Serif TC'`) resolves without the site's chrome. */}
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400&family=Noto+Serif+TC:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
