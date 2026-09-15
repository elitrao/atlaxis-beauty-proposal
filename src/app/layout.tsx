import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const onest = localFont({ src: "./onest-cyrillic-variable.woff2", variable: "--font-onest", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ATLAXIS BEAUTY | Коммерческое предложение",
  description: "Маркетинговая упаковка ATLAXIS BEAUTY: позиционирование, SEO, сайт, UGC и координация запуска.",
  keywords: ["ATLAXIS BEAUTY", "маркетинговая упаковка", "SEO", "UGC", "коммерческое предложение"],
  openGraph: {
    title: "ATLAXIS BEAUTY | Коммерческое предложение",
    description: "Интерактивное коммерческое предложение по маркетинговой упаковке проекта.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>{children}</body>
    </html>
  );
}
