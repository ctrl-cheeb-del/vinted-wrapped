import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vinted Wrapped',
  description: 'View your Vinted 2024 wrapped',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  other: {
    'msapplication-TileImage': '/favicon.ico',
    'msapplication-TileColor': '#000000'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
