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
  },

  // 🛠 Fixes for WalletConnect dependencies
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
