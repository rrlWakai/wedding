export default function SectionDivider() {
  return (
    <div className="mx-auto flex max-w-xs items-center justify-center gap-4 py-2" aria-hidden="true">
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#d9c5b2]" />
      <span className="carousel-dot h-1.5 w-1.5 bg-[#c5a059]/70" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#d9c5b2]" />
    </div>
  );
}
