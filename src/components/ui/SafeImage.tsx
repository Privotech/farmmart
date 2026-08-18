"use client";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  fallback = "/placeholder-animal.svg",
}: SafeImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.currentTarget;
        target.onerror = null;
        target.src = fallback;
      }}
    />
  );
}