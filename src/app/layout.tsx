import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HushCobbler – Footwear",
  description:
    "Handcrafted footwear that beautifies your steps. Versatile, durable, and original.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
