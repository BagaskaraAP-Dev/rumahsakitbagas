import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rumah Sakit Bagas — Ruang untuk Pulih & Sehat',
  description: 'Jelajahi Rumah Sakit Bagas dalam 3D interaktif, kenali tim dokter spesialis, serta coba simulasi janji temu online.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
