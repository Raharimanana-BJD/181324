import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "../lib/utils";
import { ThemeProvider } from "../provider/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  icons: "./mm233logo-50x50.png",
  title: "MM3-DIGITAL",
  description:
    "At MM3-DIGITAL, we provide instant access to genuine software solutions from trusted brands like Microsoft and Adobe. Whether you're looking for productivity tools, creative suites, or operating systems, we offer affordable, authentic licenses and product keys, all available for immediate download. Elevate your digital experience with software you can trust, without the wait",
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
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
