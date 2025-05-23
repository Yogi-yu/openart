'use client';

import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { bscTestnet } from "thirdweb/chains";
import Link from 'next/link';


export default function Header() {
  const account = useActiveAccount();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-gray-800">
      <Link href="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition">
         OpenArt
      </Link>
      <div className="flex items-center gap-4">
      
        <ConnectButton
          client={client}
          chain={bscTestnet}
          connectButton={{
            className:
              "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium shadow transition-all",
            label: "🔐 Connect Wallet",
          }}
        />

          {account && (
          <a
            href="/myCollections"
            className="px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 text-sm font-medium transition"
          >
            My Collections
          </a>
        )}

      </div>
    </header>
  );
}
