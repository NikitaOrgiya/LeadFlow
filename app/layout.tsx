import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl } from "@/lib/utils/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LeadFlow — сайты, Telegram-боты и цифровые сервисы для бизнеса",
    template: "%s | LeadFlow",
  },
  description:
    "LeadFlow разрабатывает сайты, Telegram-ботов, мини-CRM и автоматизацию для малого и среднего бизнеса. Рассчитайте предварительную стоимость проекта онлайн.",
  keywords: [
    "разработка сайтов",
    "telegram-бот на заказ",
    "мини-CRM",
    "автоматизация бизнес-процессов",
    "AI-помощник",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "LeadFlow",
    title: "LeadFlow — сайты, Telegram-боты и цифровые сервисы для бизнеса",
    description:
      "Рабочие MVP, автоматизация обработки заявок и интеграция сайтов, мессенджеров и внутренних систем.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
