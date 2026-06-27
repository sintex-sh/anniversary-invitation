import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'S&S • Celebrating 10 Years of Love',
  description: 'You are cordially invited to celebrate selamawit and Sintayehu’s beautiful 10-year journey of love and togetherness.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen font-sans overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
