'use client';

import React from 'react';

export default function SmartMedia({ src }: { src: string }) {
  if (!src) return null;

  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(src);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
  const isAudio = /\.(mp3|wav|ogg)$/i.test(src);

  if (isImage) {
    return (
  <img
    src={src}
    alt="NFT"
    className="w-full h-full object-cover object-center"
  />);
  }

  if (isVideo) {
    return (
      <video controls className="rounded-lg mb-2 w-full">
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (isAudio) {
    return (
      <audio controls className="rounded-lg mb-2 w-full">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  // fallback
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
      Open Media
    </a>
  );
}
