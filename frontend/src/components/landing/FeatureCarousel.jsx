import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../../data/mock';
import { FeatureDemo, DEMO_KINDS } from './Features';

/*
 * The six feature cards arranged on a slowly spinning 3D ring, shown in
 * the hero between the exam-track chips and the dashboard screenshot.
 * The ring never stops; whichever card is passing the front automatically
 * expands and plays its looping demo (no hover needed). Backfaces are
 * hidden so cards passing behind never render mirrored. Reduced-motion
 * users get a static, slightly angled ring with the first demo open.
 */
const SPIN_SECONDS = 36;
// A card counts as "front" while within this many degrees of dead centre.
const FRONT_WINDOW = 26;

export default function FeatureCarousel() {
  const n = FEATURES.length;
  // Card width 250px on a hexagonal ring → radius keeps ~40px gaps.
  const radius = 300;
  const step = 360 / n;
  const ringRef = React.useRef(null);
  const [frontIndex, setFrontIndex] = React.useState(0);
  const reduced = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  React.useEffect(() => {
    if (reduced) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const rotation = (((now - start) / (SPIN_SECONDS * 1000)) * 360) % 360;
      if (ringRef.current) ringRef.current.style.transform = `rotateY(${-rotation}deg)`;
      // Card i sits at (step*i - rotation); it faces front near 0 (mod 360).
      const nearest = Math.round(rotation / step) % n;
      const offCentre = Math.abs(((rotation - nearest * step + 540) % 360) - 180);
      setFrontIndex(offCentre <= FRONT_WINDOW ? nearest : -1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, step, n]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="carousel3d-stage mt-14 mb-2 hidden sm:flex justify-center"
      aria-label="InfinitySheets features"
    >
      <div ref={ringRef} className="carousel3d-ring" style={reduced ? { transform: 'rotateY(-15deg)' } : undefined}>
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="carousel3d-card"
            style={{ transform: `rotateY(${step * i}deg) translateZ(${radius}px)` }}
          >
            <div className={`feature-card min-h-full liquid-glass rounded-2xl px-5 py-4 text-left flex flex-col ${i === (reduced ? 0 : frontIndex) ? 'demo-open' : ''}`}>
              <div className="feature-demo">
                <FeatureDemo kind={DEMO_KINDS[i] || 'fresh'} />
              </div>
              <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{f.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed line-clamp-4">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
