import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Button from '@/components/common/Button';

const VIDEO_SOURCES = [
  '/images/gif.mp4',
];

export default function HeroVideo() {
  const bgVideoRef = useRef(null);
  const [videoActive, setVideoActive] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);

  const tryPlay = async (el) => {
    if (!el) return;
    try {
      await el.play();
      setVideoActive(true);
    } catch {
      setVideoActive(false);
    }
  };

  useEffect(() => {
    tryPlay(bgVideoRef.current);
  }, [sourceIndex]);

  const handleVideoError = () => {
    if (sourceIndex < VIDEO_SOURCES.length - 1) {
      setSourceIndex((i) => i + 1);
    } else {
      setVideoActive(false);
    }
  };

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-primary-950">
      {/* Animated fallback background — always visible */}
      <div className="absolute inset-0">
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-grid absolute inset-0 opacity-30" />
      </div>

      {/* Background video */}
      <video
        ref={bgVideoRef}
        key={`bg-${sourceIndex}`}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoActive(true)}
        onError={handleVideoError}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoActive ? 'opacity-50' : 'opacity-0'}`}
      >
        <source src={VIDEO_SOURCES[sourceIndex]} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-950/80 to-primary-900/60" />

      <div className="container-app relative flex min-h-[88vh] flex-col justify-center py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-500" />
              India's #1 Electrical Wholesale Platform
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl xl:text-6xl">
              Wholesale Electricals
              <span className="mt-2 block text-accent-400">Built for Business</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Source wires, switches, MCBs, lighting & industrial equipment from 2,500+ GST-verified vendors.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop">
                <Button className="!px-8 !py-3.5 !text-base">
                  Explore Catalog <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/wholesale">
                <Button variant="outline" className="!border-white/40 !px-8 !py-3.5 !text-base !text-white hover:!bg-white/10">
                  Request Bulk Quote
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[['50,000+', 'Products'], ['50+', 'Cities']].map(([val, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-white">{val}</p>
                  <p className="text-sm text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
