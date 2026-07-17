import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthGate } from "@/lib/auth/AuthGate";
import { GlobalNav } from "@/components/nav/GlobalNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Suite",
  description: "大学生活統合管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthGate>
          <div className="flex flex-col md:flex-row flex-1 min-h-screen">
            <GlobalNav />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
