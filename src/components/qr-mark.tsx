import { encode } from "uqr";

export function QrMark({
  value,
  label = "Verification QR code",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const qr = encode(value, { ecc: "M", border: 2 });
  const cells = qr.data;
  const n = qr.size;
  let d = "";
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      if (cells[y]?.[x]) d += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${n} ${n}`}
      className={className}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <title>{label}</title>
      <rect width={n} height={n} fill="var(--color-cream)" />
      <path d={d} fill="var(--color-forest)" />
    </svg>
  );
}
