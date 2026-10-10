import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: "Pingalshinh — Poet • Writer • Performer",
  description: "Official poetry collection and literary portfolio of Pingalshinh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-white text-gray-900">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}