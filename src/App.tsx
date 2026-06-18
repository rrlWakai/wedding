import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Countdown from './components/Countdown';
import StoryTimeline from './components/StoryTimeline';
import PrenupVideo from './components/PrenupVideo';
import WeddingDetails from './components/WeddingDetails';
import Location from './components/Location';
import DressCode from './components/DressCode';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import { weddingInfo } from './data/wedding';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function App() {
  return (
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
          <section id="story" className="bg-[#f5f0eb] px-6 py-24 sm:px-10 lg:px-20">
            <StoryTimeline events={weddingInfo.timeline} />
          </section>
          <Countdown targetDate={weddingInfo.countdownDate} backgroundImage={weddingInfo.hero.slides[0].image} />
          <section id="film" className="bg-[#ebe2d8] px-6 py-24 sm:px-10 lg:px-20">
            <PrenupVideo content={weddingInfo.prenupVideo} />
          </section>
          <section id="details" className="bg-[#f5f0eb] px-6 py-24 sm:px-10 lg:px-20">
            <WeddingDetails details={weddingInfo.details} />
          </section>
          <section className="bg-[#ebe2d8] px-6 py-24 sm:px-10 lg:px-20">
            <DressCode dressCode={weddingInfo.dressCode} />
          </section>
          <section id="gallery" className="bg-[#f5f0eb] px-6 py-24 sm:px-10 lg:px-20">
            <Gallery images={weddingInfo.gallery} />
          </section>
          <section id="location" className="bg-[#ebe2d8] px-6 py-24 sm:px-10 lg:px-20">
            <Location location={weddingInfo.location} />
          </section>
          <section id="rsvp" className="bg-[#f5f0eb] px-6 py-24 sm:px-10 lg:px-20">
            <RSVP dueDate={weddingInfo.rsvpDueDate} />
          </section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
