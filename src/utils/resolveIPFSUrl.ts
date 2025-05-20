export function resolveIPFSUrl(url?: string | null): string {
  if (!url) return '';

  try {
    // Handle ipfs:// hash
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    }

    // Handle old-style *.cf-ipfs.com gateways
    if (url.includes('cf-ipfs.com')) {
      const urlObj = new URL(url);
      const hash = urlObj.hostname.split('.')[0];
      const path = urlObj.pathname.replace(/^\/+/, '');
      return `https://nftstorage.link/ipfs/${hash}/${path}`;
    }

    // Handle *.ipfs.dweb.link or other known IPFS gateways (optional)
    const knownGateways = ['ipfs.dweb.link', 'ipfs.io', 'gateway.pinata.cloud'];
    if (knownGateways.some(domain => url.includes(domain))) {
      const match = url.match(/\/ipfs\/([^/]+)\/?(.*)?/);
      if (match) {
        const [, hash, path = ''] = match;
        return `https://nftstorage.link/ipfs/${hash}/${path}`;
      }
    }

    return url;
  } catch {
    return '';
  }
}
