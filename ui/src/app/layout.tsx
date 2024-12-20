import type { Metadata, Viewport } from "next";
import { Happy_Monkey, Fruktur } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/home/landing/NavBar";

const haMo = Happy_Monkey({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-haMo",
});

const fruk = Fruktur({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-fruk",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// export const viewport: Viewport = {
//   width: '',
//   initialScale: 0,
//   // maximumScale: 1,
//   // userScalable: false,
//   // Also supported by less commonly used
//   // interactiveWidget: 'resizes-visual',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${haMo.variable} ${fruk.variable} font-haMo`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
