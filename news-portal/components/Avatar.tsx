import Image from "next/image";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  name,
  src,
  size = 40,
  className = "",
}: AvatarProps) {
  const initials = name
    ?.split(" ")
    .map(p => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white ring-2 ring-slate-200 ring-offset-2 ring-offset-white shadow-sm overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      aria-label={name}
      title={name}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size * 2}  // 2x DPR für knackige Darstellung auf Retina
          height={size * 2}
          className="rounded-full object-cover w-full h-full"
          sizes={`${size}px`}
          priority={false}
          quality={100}
        />
      ) : (
        <span className="text-xs font-semibold text-slate-700">{initials}</span>
      )}
    </span>
  );
}