"use client";

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { usePathname } from "next/navigation";

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
}: Readonly<{ children: React.ReactNode }>) {
  // const pathname = usePathname();

  // ✅ Kiểm tra xem có đang ở trang admin không
  // const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en" className="mdl-js">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto sm:max-w-full bg-gray-950">
          <div className="flex flex-col min-h-screen">
            {/* Ẩn Navbar & Footer nếu là admin */}
            {/* {!isAdminRoute && <Navbar />} */}
            <main className="flex-grow">{children}</main>
            {/* {!isAdminRoute && <Footer />} */}
          </div>
        </div>
      </body>
    </html>
  );
}
