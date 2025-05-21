'use client';

import { ThirdwebProvider } from '@thirdweb-dev/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export function ThirdwebWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
  <ThirdwebProvider
  clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
  activeChain="binance-testnet"
  sdkOptions={{
    storage: {
      gatewayUrls: {
        "ipfs://": "https://ipfs.dweb.link/ipfs/",
      },
    },
  }}
>
  {children}
</ThirdwebProvider>
    </QueryClientProvider>
  );
}