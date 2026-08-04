"use client";

/**
 * ThemeProvider
 * -------------
 * Wraps next-themes' ThemeProvider so that:
 *  - `attribute="class"` → Tailwind's `dark` class strategy
 *  - `defaultTheme="dark"` → matches the original app default
 *  - `enableSystem={true}` → respects OS-level dark/light preference
 *    when no manual override has been saved by the user
 *  - `disableTransitionOnChange={false}` → allows our CSS transitions
 *    to animate the colour switch smoothly
 *
 * We re-export `useTheme` from next-themes so all existing consumers
 * (Navbar, etc.) can keep importing from "@/components/ThemeProvider"
 * without any changes.
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export { useTheme } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="mahanaim_theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
