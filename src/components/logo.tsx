import Image from "next/image";

// Logo oficial do Destinos Polares (public/logo-destinos-polares.svg, 905 x 182).
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-destinos-polares.svg"
      alt="Destinos Polares"
      width={905}
      height={182}
      priority
      unoptimized
      className={`h-10 w-auto lg:h-12 ${className}`}
    />
  );
}
