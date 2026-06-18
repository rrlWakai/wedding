import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { NavigationItem } from '../types';
import { useActiveSection } from '../hooks/useActiveSection';

interface NavbarProps {
  items: NavigationItem[];
}

export default function Navbar({ items }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d9c5b2]/25 bg-[#f5f0eb]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <motion.a
          href="#story"
          className="font-[Playfair_Display] text-xl uppercase tracking-[0.26em] text-[#3d2b1f] sm:text-2xl"
          whileHover={{ scale: 1.02 }}
        >
          Jerico & Glenda
        </motion.a>
        <nav className="hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-xs uppercase tracking-[0.3em] transition-colors duration-200 ${
                activeSection === item.id
                  ? 'text-[#6f4c2e]'
                  : 'text-[#8a735c] hover:text-[#6f4c2e]'
              }`}
            >
              {item.label}
            </a>
          ))}

        </nav>
        <button
          type="button"
          className="theme-rounded inline-flex items-center justify-center border border-[#d9c5b2]/50 bg-white/80 p-3 text-[#6f4c2e] shadow-sm lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="border-t border-[#d9c5b2]/25 bg-[#f5f0eb]/95 px-6 py-6 shadow-lg lg:hidden"
        >
          <div className="space-y-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="theme-rounded block px-4 py-3 text-sm uppercase tracking-[0.24em] text-[#5c4a3d] hover:bg-[#f5d396]/20 hover:text-[#6f4c2e]"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#rsvp"
              className="theme-btn-primary mt-4 w-full"
              onClick={() => setIsOpen(false)}
            >
              RSVP
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
