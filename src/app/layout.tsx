import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mahanaim Miraj NGO | Sheltering Orphaned & Abandoned Children",
  description:
    "Mahanaim Miraj NGO provides safe shelter, food, healthcare, and education for orphaned and abandoned children, alongside blanket distribution and women empowerment drives in Miraj, Maharashtra.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "Mahanaim Miraj",
    "NGO Miraj",
    "Orphanage Miraj",
    "Donate to NGO",
    "Blanket distribution drive",
    "80G Tax Exemption NGO",
    "Child shelter Maharashtra",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/*
        suppressHydrationWarning is REQUIRED when using next-themes.
        next-themes injects a script that sets the class on <html> before
        React hydrates. Without this attribute, React will warn about
        the class mismatch between server and client renders.

        Do NOT hardcode a "dark" class here — next-themes manages it.
      */}
      <html lang="en" className={outfit.variable} suppressHydrationWarning>
        <body className="antialiased min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-300">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
