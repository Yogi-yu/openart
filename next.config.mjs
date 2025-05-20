/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable image optimization for external NFT image sources
  images: {
    domains: [
      'ipfs.io',
      'nftstorage.link',
      'gateway.pinata.cloud',
      'thirdweb.com',
     
    ],
     remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.ipfs.dweb.link',
    },

      {
        protocol: 'https',
        hostname: '**.ipfscdn.io', // ✅ Allow any subdomain
      },
  ],
    
  },

  // 🛠 Fixes for WalletConnect dependencies
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
