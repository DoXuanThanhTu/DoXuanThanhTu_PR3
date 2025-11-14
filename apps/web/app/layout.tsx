// ❌ Không dùng "use client" ở RootLayout của Next.js
// (RootLayout luôn phải là server component)

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className="mdl-js">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto sm:max-w-full bg-gray-950">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
