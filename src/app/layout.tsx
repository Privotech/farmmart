import type { Metadata } from "next";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
// import { Footer } from "@/components/layout/Footer";
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
    <html lang="en">
      <body>
        <Providers>
          <NavbarWrapper />
          <main>{children}</main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
