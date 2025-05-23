import { ThirdwebProvider } from "thirdweb/react";
import Header from '@/components/header';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main>{children}</main>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
