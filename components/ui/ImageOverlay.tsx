type ImageOverlayProps = {
  opacity?: number;
  className?: string;
};

export default function ImageOverlay({ opacity = 0.42, className = "" }: ImageOverlayProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-black ${className}`}
      style={{ opacity }}
    />
  );
}
