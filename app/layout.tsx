import type { Metadata } from "next";
import { Inter, Merriweather, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { client } from "@/sanity/lib/client";
import Navbar from "@/components/Navbar";
import BottomBanner from "@/components/BottomBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Website",
  description: "My personal portfolio and reading list.",
};

// Revalidate every 60 seconds
export const revalidate = 60;

async function getGlobalData() {
  const query = `*[_type == "profile"][0] {
    "resumeUrl": resume.asset->url,
    bannerText
  }`;
  return client.fetch(query);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getGlobalData();
  const { resumeUrl, bannerText } = data || {};

  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} ${patrickHand.variable}`}>
        <Navbar resumeUrl={resumeUrl} />
        {children}
        <BottomBanner text={bannerText} />
      </body>
    </html>
  );
}
