interface SectionDividerProps {
  /** Positioning/size classes. Defaults to centered, responsive width. */
  className?: string;
}

export default function SectionDivider({
  className = 'mx-auto w-[clamp(11.25rem,62vw,20rem)]',
}: SectionDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-[18px] py-1 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#d9c6a8]" />
      <span className="carousel-dot h-1.5 w-1.5 shrink-0 bg-[#c9a052]" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#d9c6a8]" />
    </div>
  );
}
