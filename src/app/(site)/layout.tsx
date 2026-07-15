import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC, JetBrains_Mono } from "next/font/google";
import "./site.css";
import { getSiteSettings } from "@/lib/items";
import { getIsAuthor } from "@/lib/auth";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-notoserif-tc",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-notosans-tc",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.title,
    description: settings.intro || settings.motto,
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, isAuthor] = await Promise.all([
    getSiteSettings(),
    getIsAuthor(),
  ]);

  return (
    <div
      className={`${notoSerifTC.variable} ${notoSansTC.variable} ${jbMono.variable} site-root flex min-h-screen flex-col bg-paper font-sans-tc text-ink`}
    >
      <Header settings={settings} isAuthor={isAuthor} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} isAuthor={isAuthor} />
    </div>
  );
}
