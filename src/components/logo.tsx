import Image from "next/image";

// Logo oficial do Destinos Polares (public/logo-destinos-polares.png, 1792 x 356).
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-destinos-polares.png"
      alt="Destinos Polares"
      width={1792}
      height={356}
      priority
      className={`h-10 w-auto lg:h-12 ${className}`}
    />
  );
}
