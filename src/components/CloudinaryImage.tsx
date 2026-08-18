"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

function isVersionedCloudinaryUrl(src: string) {
  return /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/.+\/v\d+\//.test(src);
}

/** Optimizes uploaded Cloudinary assets while retaining other supported URLs. */
export function CloudinaryImage({ src, alt, ...props }: CloudinaryImageProps) {
  if (isVersionedCloudinaryUrl(src)) {
    return (
      <CldImage
        src={src}
        alt={alt}
        crop="fill"
        gravity="auto"
        sizes={props.sizes ?? "(max-width: 768px) 100vw, 33vw"}
        {...props}
      />
    );
  }

  return <Image src={src} alt={alt} {...props} />;
}
