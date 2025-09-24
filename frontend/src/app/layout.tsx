import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./components/theme-provider";
import localFont  from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const novecento = localFont ({
  src: [
    {
      path: './fonts/Novecentosanswide-Light.otf',
      weight: '400',
      style: 'light',
    },
    {
      path: './fonts/Novecentosanswide-Normal.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Novecentosanswide-DemiBold.otf',
      weight: '600',
      style: 'demibold',
    },
  ],
  variable: '--font-novecento',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Osmora App",
  description: "Every Moment, Beautifully Captured",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${novecento.variable} antialiased h-full w-full overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
