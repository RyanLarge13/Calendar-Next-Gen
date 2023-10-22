import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Calendar Next Gen - next generation calendar application",
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
        <Footer />
      </body>
    </html>
  );
}
