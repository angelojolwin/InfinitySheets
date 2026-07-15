import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import Mascot from '../decor/Mascot';

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
  const stageRef = React.useRef(null);
  const angleRef = React.useRef(0);        // current rotation in degrees
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
      } else {
        // Never pauses — hover only reveals the paging arrows.
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

  // Horizontal wheel / side-scroll spins the ring directly. Registered
  // manually because React's onWheel is passive (preventDefault ignored).
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const onWheel = (e) => {
      // Horizontal input arrives differently per mouse/driver: true deltaX
      // (trackpads, MX-series thumb wheels on some drivers) or as a
      // shift+vertical wheel (other drivers). Treat both as spin input;
      // plain vertical wheel still scrolls the page.
      let dx = 0;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) dx = e.deltaX;
      else if (e.shiftKey && e.deltaY !== 0) dx = e.deltaY;
      if (!dx) return;
      if (e.deltaMode === 1) dx *= 16; // line-based deltas → approx pixels
      e.preventDefault();
      animRef.current = null;
      angleRef.current += dx * 0.25;
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [reduced]);

  return (
    <section className="section-bg overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 pt-4 pb-14 text-center">
        <Reveal>
          <div className="relative inline-block">
            <div className="eyebrow mb-3">In the wild</div>
            <h2 className="h-display text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.05]">Students already studying with it.</h2>
            {/* Sheety drifting alongside the heading */}
            <div className="hidden lg:block absolute -right-28 -top-8 pointer-events-none" aria-hidden="true">
              <Mascot pose="float" width={86} />
            </div>
          </div>
        </Reveal>
        <div
          ref={stageRef}
          className="gallery3d-stage mt-10 relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
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
