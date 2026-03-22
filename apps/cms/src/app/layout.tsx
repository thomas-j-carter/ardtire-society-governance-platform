import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Ardtire Society CMS',
  description: 'Editorial content management surface'
};

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}
