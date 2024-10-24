import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import { ThemeProvider } from "../provider/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: true,
});
export const metadata: Metadata = {
  title: "MM3-DIGITAL",
  description:
    "At MM3-DIGITAL, we provide instant access to genuine software solutions from trusted brands like Microsoft and Adobe. Whether you're looking for productivity tools, creative suites, or operating systems, we offer affordable, authentic licenses and product keys, all available for immediate download. Elevate your digital experience with software you can trust, without the wait",
  icons: {
    icon: "/public/mm233logo-50x50.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
