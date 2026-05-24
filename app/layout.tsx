import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fitrip - あなたの理想の旅を、自由にリメイクしよう",
  description: "行き先・こだわり・スタイルに合わせてAIが最適な旅程を提案するトラベルアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  );
}
