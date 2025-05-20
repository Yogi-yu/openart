export function resolveIPFSUrl(url?: string | null): string {
  if (!url) return '';

  try {
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    }

    if (url.includes('cf-ipfs.com')) {
      const urlObj = new URL(url);
      const hash = urlObj.hostname.split('.')[0];
      const path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
      return `https://nftstorage.link/ipfs/${hash}/${path}`;
    }

    return url;
  } catch (e) {
    return '';
  }
}
