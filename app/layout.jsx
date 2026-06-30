import './globals.css';

export const metadata = {
  title: 'Mishal KS — Full-Stack & AI Developer',
  description: 'Full-Stack Developer & MCA student at JAIN University, building mobile, web, blockchain and AI solutions.',
  keywords: 'Full-Stack, Flutter, Next.js, React, Firebase, Blockchain, Solidity, AI, ML, Python, FastAPI, Flask',
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
