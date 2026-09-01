// =============================================================================
// BuyTuk Academy - Root Layout
// =============================================================================

import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "BuyTuk Academy | منصة بوتك التعليمية",
  description: "منصة تعليمية موحّدة شاملة لتعليم اللغة العربية والمواد الأخرى بتقنيات الذكاء الاصطناعي.",
  keywords: ["تعليم", "قراءة", "ذكاء اصطناعي", "عربي", "BuyTuk"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="bg-slate-50 text-slate-900 font-arabic antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}