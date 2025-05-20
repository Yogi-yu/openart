import { useEffect, useState } from 'react';
import { resolveIPFSUrl } from '@/utils/resolveIPFSUrl';

export function useListingImage(metadataUrl?: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!metadataUrl) return;
      try {
        const res = await fetch(resolveIPFSUrl(metadataUrl));
        const json = await res.json();
        const finalImage = resolveIPFSUrl(json.image);
        setImageUrl(finalImage);
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
        setImageUrl(null);
      }
    }

    load();
  }, [metadataUrl]);

  return imageUrl;
}
