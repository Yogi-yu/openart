// utils/resolveIPFSUrl.ts
export function resolveIPFSUrl(uri?: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  const ipfsMatch = uri.match(/\/ipfs\/(.*)/);
  if (ipfsMatch) {
    return `https://ipfs.io/ipfs/${ipfsMatch[1]}`;
  }
  return uri;
}
