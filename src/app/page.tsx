'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold mb-6">🎨 Welcome to OpenArt</h1>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        A decentralized crypto art platform where artists fund, launch, and sell NFTs directly.
      </p>

      <div className="flex gap-6">
        <Link
          href="/marketplace"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
        >
          🛍 Visit Marketplace
        </Link>
        <Link
          href="/crowdfund"
          className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-xl font-semibold"
        >
          💡 Start Crowdfund
        </Link>
      </div>
    </main>
  );
}
