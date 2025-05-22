import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { ThirdwebProvider } from "thirdweb/react";
 import { client } from "./client";
import { ConnectButton } from "thirdweb/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenArt',
  description: 'Your crypto art platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <html lang="en">
      <body>

        <ThirdwebProvider>
      <header className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-wide">OpenArt</h1>
    <ConnectButton client={client} 
      connectButton={{
    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium shadow transition-all",
    label: "🔐 Connect Wallet",
    }}
      />
      </header>
      
      
      <main>{children}</main>


       </ThirdwebProvider>
      </body>
    </html>
  );
}
