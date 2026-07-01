import React from 'react';

interface ImageDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'cover', borderRadius: '8px' }}
    />
  );
};
