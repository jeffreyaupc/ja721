import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "尚未命名",
  description: "觀察、創作、作品的個人筆記。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
