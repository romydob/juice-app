import "./globals.css";
import { Racing_Sans_One, Exo } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import SupabaseProvider from "@/components/SupabaseProvider";

// Import fonts with Next.js
const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const exo = Exo({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${racingSansOne.variable} ${exo.variable}`}>
      <head>
        {/* Essential viewport meta tag for responsive Tailwind classes */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Zaaki</title>
      </head>
      <body className="font-body">
        <Navbar />
        <SupabaseProvider session={null}>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
