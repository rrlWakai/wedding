import SectionDivider from './SectionDivider';

export default function Footer() {
  return (
    <footer className="border-t border-[#d9c5b2]/30 bg-[#ebe2d8] py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:px-10">
        <p className="section-script text-[#c5a059]">Jerico & Glenda</p>
        <SectionDivider />
        <div className="flex flex-wrap justify-center gap-6 text-sm uppercase tracking-[0.28em] text-[#5c4a3d]">
          <a href="#story" className="transition hover:text-[#6f4c2e]">
            Our Story
          </a>
          <a href="#film" className="transition hover:text-[#6f4c2e]">
            Our Film
          </a>
          <a href="#location" className="transition hover:text-[#6f4c2e]">
            Venue
          </a>
          <a href="#rsvp" className="transition hover:text-[#6f4c2e]">
            RSVP
          </a>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[#5c4a3d]/85">
          This invitation is a keepsake for the season we celebrate together.
        </p>
      </div>
    </footer>
  );
}
