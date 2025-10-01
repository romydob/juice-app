import "./globals.css";
import { Racing_Sans_One } from "next/font/google";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import SupabaseProvider from "@/components/SupabaseProvider";

const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-racing-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${racingSansOne.variable} font-body`}>
      <body>
        <Navbar />
        <SupabaseProvider session={null}>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
