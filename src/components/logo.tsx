// Logo provisório do Destinos Polares, no mesmo formato do logo da Let's Go
// Polar: um selo redondo com um iceberg e o nome em duas linhas.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#fff" stroke="#042c43" strokeWidth="2.5" />
        <path d="M9 27h30" stroke="#042c43" strokeWidth="1.5" />
        <path d="M14 27l7-12 4 5 3-3 6 10z" fill="#079ec3" />
        <path d="M21 15l2 6-3 6M28 17l-1 5 3 5" stroke="#042c43" strokeWidth="1.2" fill="none" />
        <path d="M16 27l5 10 4-5 3 6 4-11z" fill="#9fd8e8" />
      </svg>
      <span className="flex flex-col border-l border-primary pl-2.5 leading-none">
        <span className="text-[15px] font-extrabold tracking-wide text-primary">DESTINOS</span>
        <span className="text-[15px] font-extrabold tracking-wide text-accent">POLARES</span>
      </span>
    </span>
  );
}
