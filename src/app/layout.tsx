import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mani Mari Siva P | IoT & AI Portfolio",
  description: "Personal portfolio of Mani Mari Siva P, a B.Tech Information Technology student specializing in IoT, AI, embedded systems, and web technologies.",
  keywords: ["IoT", "AI", "Embedded Systems", "B.Tech IT", "Mani Mari Siva P", "Web Development", "Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
