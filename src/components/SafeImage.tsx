import React, { useEffect, useState } from "react";

/* Image with graceful degradation for library artwork:
   - local-first src + native lazy loading (no IntersectionObserver, so it
     can't misfire inside freshly opened windows)
   - explicit aspect-ratio support so layout never collapses to 0px
   - onError swaps to a branded placeholder instead of a broken icon */
const FALLBACK = "/images/fallback-cover.png";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  ratio?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = FALLBACK,
  ratio,
  style,
  alt = "",
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <img
      src={failed ? fallbackSrc : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => {
        if (!failed) setFailed(true);
      }}
      style={ratio ? { aspectRatio: ratio, ...style } : style}
      {...rest}
    />
  );
}
