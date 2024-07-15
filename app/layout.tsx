import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "@/styles/global.css";
import "@/styles/theme.css";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "诲知留学AI",
  description: "诲知留学Coze AI管理平台",
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
          "min-h-screen bg-background font-sans antialiased",
          fontInter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            {children}
            <Toaster duration={3000} />
          </ReactQueryProvider>
        </ThemeProvider>

        <Script
          src="https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/0.1.0-beta.4/libs/oversea/index.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
