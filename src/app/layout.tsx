import type {Metadata} from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Printful Boutique',
  description: 'Your one-stop shop for high-quality print-on-demand products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-full">
        <Providers>
          <Header />
          <main>
            <div className="flex-grow">{children}</div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
