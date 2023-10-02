import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title:
    "Calendar Next Gen - the calendar application for the future genertion stay organized and accomplish",
  description:
    "Calendar application of the future generation. Organize, evolve & increase productivity in your life, connect and accomplish",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
