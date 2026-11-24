import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppConvexProvider } from "@/providers/ConvexClientProvider";

export const viewport: Viewport = {
  themeColor: "#201E1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SHYN — The Royal Indian Dining Experience",
  description:
    "An exquisite sanctuary where time-honoured royal Indian culinary secrets converge with modern gastronomy. Real-time table dining, live tandoor and artisanal delicacies.",
  keywords: [
    "SHYN restaurant",
    "fine dining",
    "Indian restaurant",
    "royal cuisine",
    "dum biryani",
    "galouti kebab",
    "table ordering",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F4EE] text-[#201E1A] selection:bg-[#B39460] selection:text-white">
        <AppConvexProvider>{children}</AppConvexProvider>
      </body>
    </html>
  );
}
