import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const title = "GitHub README Generator";
const description = "Effortless GitHub READMEs—just drop a link & done!";
const logo = "/github.png";
const ogImage = "/github.png";

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    images: [
      {
        url: ogImage,
        alt: title
      }
    ],
    siteName: "GitHub README Generator"
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [ogImage]
  },
  icons: {
    icon: logo
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
