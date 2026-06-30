import './globals.css';

export const metadata = {
  title: 'Mishal KS — Full-Stack & AI Developer',
  description: 'Full-Stack Developer & MCA student at JAIN University, building mobile, web, blockchain and AI solutions.',
  keywords: 'Full-Stack, Flutter, Next.js, React, Firebase, Blockchain, Solidity, AI, ML, Python, FastAPI, Flask',
  openGraph: {
    title: 'Mishal KS — Full-Stack & AI Developer',
    description: 'Full-Stack Developer & MCA student at JAIN University, building mobile, web, blockchain and AI solutions.',
    url: 'https://mishalmca.vercel.app',
    siteName: 'Mishal KS Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mishal KS — Full-Stack & AI Developer',
    description: 'Full-Stack Developer & MCA student at JAIN University, building mobile, web, blockchain and AI solutions.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
