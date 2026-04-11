import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HospoLink - Find Hospitality Staff Instantly",
  description:
    "Connect directly with experienced local baristas, chefs, and wait staff without the friction of complex applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-[#FAFAFA] text-[#111111] antialiased overflow-x-hidden selection:bg-[#111111] selection:text-white">
        {children}
      </body>
    </html>
  );
}
