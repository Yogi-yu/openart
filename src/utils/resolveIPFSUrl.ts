export function resolveIPFSUrl(url?: string | null): string {
  if (!url) return '';

  try {
    // Convert ipfs://... to dweb.link
    if (url.startsWith('ipfs://')) {
      const hashPath = url.replace('ipfs://', '');
      const [cid, ...rest] = hashPath.split('/');
      return `https://${cid}.ipfs.dweb.link/${rest.join('/')}`;
    }

    // Convert *.cf-ipfs.com to dweb.link
    if (url.includes('cf-ipfs.com')) {
      const urlObj = new URL(url);
      const cid = urlObj.hostname.split('.')[0];
      const path = urlObj.pathname.replace(/^\/+/, '');
      return `https://${cid}.ipfs.dweb.link/${path}`;
    }

    // Convert ipfs.io/gateway-style to dweb.link
    if (url.includes('/ipfs/')) {
      const match = url.match(/\/ipfs\/([^/]+)\/?(.*)?/);
      if (match) {
        const [, cid, path = ''] = match;
        return `https://${cid}.ipfs.dweb.link/${path}`;
      }
    }

    return url;
  } catch {
    return '';
  }
}
