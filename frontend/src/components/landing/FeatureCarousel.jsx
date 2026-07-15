import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../../data/mock';
import { FeatureDemo, DEMO_KINDS } from './Features';

/*
 * The six feature cards on a 2D conveyor belt in the hero, between the
 * exam-track chips and the dashboard screenshot. The belt scrolls left
 * continuously and never pauses (hover included); every card's looping
 * demo stays open and playing as it rides past. The card list is
 * rendered twice so the CSS keyframe loop (-50%) wraps seamlessly.
 * Reduced-motion users get a static row of the first three cards.
 */
export default function FeatureCarousel() {
  const reduced = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const cards = reduced ? FEATURES.slice(0, 3) : [...FEATURES, ...FEATURES];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      id="features"
      className="carousel-belt mt-14 mb-2 scroll-mt-24"
      aria-label="InfinitySheets features"
    >
      <div className={`carousel-belt-track ${reduced ? 'justify-center' : ''}`} style={reduced ? { animation: 'none' } : undefined}>
        {cards.map((f, i) => {
          const demoIndex = i % FEATURES.length;
          return (
            <div key={`${f.title}-${i}`} className="carousel-belt-card" aria-hidden={i >= FEATURES.length}>
              <div className="feature-card demo-open h-full liquid-glass rounded-2xl px-5 py-4 text-left flex flex-col">
                <div className="feature-demo">
                  <FeatureDemo kind={DEMO_KINDS[demoIndex] || 'fresh'} />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{f.title}</h3>
                <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed line-clamp-4">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
