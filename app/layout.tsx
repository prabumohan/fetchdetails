import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Network Details - What's My IP",
  description: "Get your IP address, location, ISP, and network information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

