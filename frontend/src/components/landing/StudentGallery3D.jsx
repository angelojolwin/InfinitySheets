import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

/*
 * A slowly spinning 3D ring of student photos, shown between the hero
 * dashboard screenshot and the product stats strip. It rotates on its
 * own and never stops — except while the mouse is over it, when arrows
 * appear and the visitor can page card-by-card (still animated in 3D).
 *
 * The five slots are SVG placeholders for now; drop real photos into
 * PHOTOS below (an `img` field replaces the placeholder art).
 */
const PHOTOS = [
  { caption: 'Late-night JEE prep', tone: '#3b82f6', emoji: '📐', img: null },
  { caption: 'IGCSE Physics session', tone: '#8b5cf6', emoji: '⚡', img: null },
  { caption: 'Worksheet on the bus', tone: '#f59e0b', emoji: '📱', img: null },
  { caption: 'Study group, one dashboard', tone: '#10b981', emoji: '👥', img: null },
  { caption: 'Predicted grade day', tone: '#ef4444', emoji: '🎯', img: null },
];

const SPIN_SECONDS = 40;
const STEP_ANIM_MS = 600;

function Placeholder({ tone, emoji, caption }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 rounded-t-2xl flex items-center justify-center text-[44px]"
        style={{ background: `linear-gradient(135deg, ${tone}22, ${tone}55)` }}>
        <span role="img" aria-hidden="true">{emoji}</span>
      </div>
      <div className="px-4 py-3 text-left">
        <div className="text-[13.5px] font-semibold text-slate-900">{caption}</div>
        <div className="text-[11.5px] text-slate-500">Student photo coming soon</div>
      </div>
    </div>
  );
}

export default function StudentGallery3D() {
  const n = PHOTOS.length;
  const step = 360 / n;
  const radius = 300;
  const ringRef = React.useRef(null);
  const angleRef = React.useRef(0);        // current rotation in degrees
  const pausedRef = React.useRef(false);   // true while hovered
  const animRef = React.useRef(null);      // {from, to, start} while paging
  const [hovered, setHovered] = React.useState(false);
  const reduced = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  React.useEffect(() => {
    if (reduced) return;
    let raf;
    let last = performance.now();
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => {
      const dt = now - last;
      last = now;
      const anim = animRef.current;
      if (anim) {
        const t = Math.min(1, (now - anim.start) / STEP_ANIM_MS);
        angleRef.current = anim.from + (anim.to - anim.from) * easeInOut(t);
        if (t >= 1) animRef.current = null;
      } else if (!pausedRef.current) {
        angleRef.current += (dt / (SPIN_SECONDS * 1000)) * 360;
      }
      if (ringRef.current) ringRef.current.style.transform = `rotateY(${-angleRef.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Page to the next/previous card: animate to the nearest slot boundary in
  // that direction so a card lands dead-centre.
  const page = (dir) => {
    const from = animRef.current ? animRef.current.to : angleRef.current;
    const slot = dir > 0 ? Math.floor(from / step + 1e-4) + 1 : Math.ceil(from / step - 1e-4) - 1;
    animRef.current = { from, to: slot * step, start: performance.now() };
  };

  return (
    <section className="section-bg overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 pt-4 pb-14 text-center">
        <Reveal>
          <div className="eyebrow mb-3">In the wild</div>
          <h2 className="h-display text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.05]">Students already studying with it.</h2>
        </Reveal>
        <div
          className="gallery3d-stage mt-10 relative"
          onMouseEnter={() => { pausedRef.current = true; setHovered(true); }}
          onMouseLeave={() => { pausedRef.current = false; setHovered(false); }}
        >
          <div ref={ringRef} className="gallery3d-ring" style={reduced ? { transform: 'rotateY(-15deg)' } : undefined}>
            {PHOTOS.map((p, i) => (
              <div key={p.caption} className="gallery3d-card" style={{ transform: `rotateY(${step * i}deg) translateZ(${radius}px)` }}>
                <div className="w-full h-full liquid-glass rounded-2xl overflow-hidden">
                  {p.img
                    ? <img src={p.img} alt={p.caption} className="w-full h-full object-cover" />
                    : <Placeholder tone={p.tone} emoji={p.emoji} caption={p.caption} />}
                </div>
              </div>
            ))}
          </div>
          {hovered && !reduced && (
            <>
              <button onClick={() => page(-1)} aria-label="Previous photo"
                className="absolute left-[8%] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full liquid-glass border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => page(1)} aria-label="Next photo"
                className="absolute right-[8%] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full liquid-glass border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        {/* Phones get a simple swipeable strip instead of the 3D ring */}
        <div className="gallery3d-mobile mt-8 gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
          {PHOTOS.map((p) => (
            <div key={p.caption} className="snap-center shrink-0 w-[240px] h-[170px] liquid-glass rounded-2xl overflow-hidden">
              {p.img
                ? <img src={p.img} alt={p.caption} className="w-full h-full object-cover" />
                : <Placeholder tone={p.tone} emoji={p.emoji} caption={p.caption} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
