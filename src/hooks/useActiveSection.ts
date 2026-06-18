import { useEffect, useState } from 'react';

const sections = ['story', 'film', 'details', 'gallery', 'rsvp'];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('story');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.innerHeight * 0.35;
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= offset && rect.bottom >= offset;
      });
      setActiveSection(current ?? 'story');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return activeSection;
}
