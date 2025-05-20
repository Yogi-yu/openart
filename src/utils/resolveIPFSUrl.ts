export function resolveIPFSUrl(uri?: string | null): string {
  if (!uri) return "";

  // Handle ipfs://Qm... format
  if (uri.startsWith("ipfs://")) {
    const parts = uri.replace("ipfs://", "").split("/");
    const cid = parts[0];
    const path = parts.slice(1).join("/");
    return `https://${cid}.ipfs.dweb.link/${path}`;
  }

  // Handle legacy .cf-ipfs.com gateway URLs
  if (uri.includes(".cf-ipfs.com")) {
    const url = new URL(uri);
    const cid = url.hostname.split(".")[0];
    const path = url.pathname.replace(/^\/+/, "");
    return `https://${cid}.ipfs.dweb.link/${path}`;
  }

  // Already HTTP or custom gateway
  return uri;
}
