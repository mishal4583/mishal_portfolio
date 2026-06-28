import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Name - Generative AI Portfolio",
  description: "Aspiring Master of Computer Applications student with a strong portfolio in Generative AI. Experienced in developing full-stack applications.",
  keywords: "Generative AI, Machine Learning, AI/ML, Full-stack Developer, Python, FastAPI, Flask, Flutter, GPT-2, Stable Diffusion, Portfolio, MCA, Computer Vision",
  // CORRECTED: Changed 'author' to 'authors' and used the recommended object format
  authors: [{ name: "Your Name" }],
  // You can also add a URL if you have a personal website for the author
  // authors: [{ name: "Your Name", url: "https://yourportfolio.com" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon - assuming it's in public/favicon.ico */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* Google Fonts from your original HTML */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />

        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}