import type { Metadata } from "next";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "FarmMart - Farm Animal Marketplace",
  description: "Your trusted farm animal marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <NavbarWrapper />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}