'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Ghost } from 'lucide-react';

interface GameImageProps extends Omit<ImageProps, 'onError'> {
  fallbackIcon?: React.ReactNode;
}

export function GameImage({ src, alt, className, fallbackIcon, ...props }: GameImageProps) {
  const [error, setError] = useState(false);

  // If source is missing or error occurred, show fallback
  if (!src || error) {
    return (
      <div className={cn("flex items-center justify-center bg-zinc-900 text-zinc-700 w-full h-full", className)}>
        {fallbackIcon || <Ghost className="w-1/2 h-1/2 opacity-30" />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("object-contain", className)}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
