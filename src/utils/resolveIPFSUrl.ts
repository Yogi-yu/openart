export function resolveIPFSUrl(uri?: string | null): string {
  if (!uri) return '';

  console.log('[resolveIPFSUrl] input:', uri);

  // Handle ipfs://CID/... format
  if (uri.startsWith('ipfs://')) {
    const parts = uri.replace('ipfs://', '').split('/');
    const cid = parts[0];
    const path = parts.slice(1).join('/');
    const result = `https://${cid}.ipfs.dweb.link/${path}`;
    console.log('[resolveIPFSUrl] output (ipfs://):', result);
    return result;
  }

  try {
    const url = new URL(uri);

    // Handle any gateway path like /ipfs/<CID>/path
    const match = url.pathname.match(/^\/ipfs\/([^/]+)(\/.*)?$/);
    if (match) {
      const cid = match[1];
      const path = match[2] || '';
      const result = `https://${cid}.ipfs.dweb.link${path}`;
      console.log('[resolveIPFSUrl] output (from ipfs path):', result);
      return result;
    }
  } catch (err) {
    console.warn('[resolveIPFSUrl] Invalid URL:', uri);
  }

  // Return as-is if no pattern matched
  console.log('[resolveIPFSUrl] output (unchanged):', uri);
  return uri;
}
