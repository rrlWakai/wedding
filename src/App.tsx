import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Countdown from './components/Countdown';
import StoryTimeline from './components/StoryTimeline';

import Location from './components/Location';
import DressCode from './components/DressCode';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import { weddingInfo } from './data/wedding';
import AnnouncementStrip from './components/AnnouncementStrip';
import CurvedGallery from './components/CurvedGallery';
import Preloader from './components/Preloader';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function App() {
  return (
    <>
      <Preloader
        names={weddingInfo.hero.heading}
        imageToPreload={weddingInfo.hero.slides[0].image}
      />
      <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen bg-[#f5f0eb] text-[#3d2b1f]"
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Navbar items={weddingInfo.navigation} />
        <main className="overflow-x-hidden">
          <HeroCarousel hero={weddingInfo.hero} />
          <AnnouncementStrip />
          <CurvedGallery />
          <section id="story" className="scroll-mt-20 bg-transparent px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-20">
            <StoryTimeline events={weddingInfo.timeline} />
          </section>
          <section id="gallery" className="scroll-mt-20 bg-transparent px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-20">
            <Gallery images={weddingInfo.gallery} />
          </section>
          <Countdown targetDate={weddingInfo.countdownDate} backgroundImage="/CountDownSection/Cd.jpg" />
         
          <section id="location" className="scroll-mt-20 bg-[var(--beige)] p-0">
            <Location locations={weddingInfo.locations} />
          </section>
          <section className="bg-[#ebe2d8] px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-20">
            <DressCode dressCode={weddingInfo.dressCode} />
          </section>
          <section id="rsvp" className="scroll-mt-20 bg-[#f5f0eb] px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-20">
            <RSVP dueDate={weddingInfo.rsvpDueDate} />
          </section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
    </>
  );
}

export default App;
