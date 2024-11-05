export default function MockNextImage({
  src,
  alt,
  className,
  onError,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
      width={width}
      height={height}
    />
  );
}
