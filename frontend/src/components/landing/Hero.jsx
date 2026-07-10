import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import InfinityBackground from '../decor/InfinityBackground';
import { DoodleBooks, DoodleFlask, DoodleEquations } from '../decor/StudyDoodles';
import { EXAM_TRACKS } from '../../data/mock';

/* The heading is static except the word "you", which types itself out
   slowly with a caret. Width is reserved so layout never shifts. */
function TypedHero() {
  const WORD = 'you';
  const [count, setCount] = useState(0);
  const done = count >= WORD.length;
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(WORD.length); return; }
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 900 : 420);
    return () => clearTimeout(t);
  }, [count, done]);

  return (
    <h1 className="h-display text-[56px] sm:text-[80px] lg:text-[108px] leading-[1.02] max-w-[1080px]" aria-label="A study tool tailored just for you.">
      A study tool tailored just for{' '}
      <span aria-hidden="true" className="relative inline-block font-serif-italic">
        <span className="invisible">{WORD}</span>
        <span className="absolute inset-0">
          {WORD.slice(0, count)}
          {!done && <span className="type-caret" />}
        </span>
      </span>
      <span aria-hidden="true">.</span>
    </h1>
  );
}

/* Always-visible labels around the screenshot, connected to the UI they
   describe by arrows. tx/ty = arrow target, bx/by = box position (% of
   the image box). Clicking a label jumps to the matching section. */
const CALLOUTS = [
  { tx: 55, ty: 26, bx: 68, by: 12, align: 'left', label: 'Study streak', desc: 'Practice becomes a habit', href: '#how' },
  { tx: 88, ty: 9, bx: 76, by: 30, align: 'left', label: 'New worksheet', desc: 'Fresh questions in one click', href: '#try' },
  { tx: 80, ty: 55, bx: 88, by: 78, align: 'left', label: 'Upcoming exams', desc: 'Per-subject countdowns', href: '#faq' },
  { tx: 25, ty: 44, bx: 6, by: 20, align: 'right', label: 'Days until exam', desc: 'Set the date, stay focused', href: '#faq' },
  { tx: 46, ty: 62, bx: 10, by: 50, align: 'right', label: "Today's goal", desc: 'A daily target you can hit', href: '#how' },
  { tx: 43, ty: 82, bx: 12, by: 92, align: 'right', label: 'Weak topics', desc: 'Found automatically', href: '#features' },
];

function CalloutLabels() {
  return (
    <>
      {/* arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" aria-hidden="true">
        <defs>
          <marker id="callout-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L7 4 L0 8 Z" fill="#3b82f6" />
          </marker>
        </defs>
        {CALLOUTS.map((c) => (
          <line
            key={c.label}
            x1={`${c.bx + (c.align === 'left' ? 2 : 6)}%`} y1={`${c.by}%`}
            x2={`${c.tx}%`} y2={`${c.ty}%`}
            stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#callout-arrow)"
            opacity="0.85"
          />
        ))}
      </svg>
      {/* label boxes */}
      {CALLOUTS.map((c) => (
        <a
          key={c.label}
          href={c.href}
          className="hidden md:block absolute z-10 liquid-glass rounded-xl px-3.5 py-2 w-[172px] hover-lift"
          style={{ left: `${c.bx}%`, top: `${c.by}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="text-[12.5px] font-semibold text-slate-900 leading-tight">{c.label}</div>
          <div className="text-[11px] text-slate-600 leading-snug">{c.desc}</div>
        </a>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative section-bg overflow-hidden">
      <InfinityBackground variant="hero" />
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="hidden xl:block absolute left-[4%] top-[26%] opacity-90 pointer-events-none"><DoodleBooks /></div>
      <div className="hidden xl:block absolute left-[7%] top-[62%] opacity-80 pointer-events-none"><DoodleEquations width={130} /></div>
      <div className="hidden xl:block absolute right-[5%] top-[28%] opacity-90 pointer-events-none"><DoodleFlask /></div>
      <div className="relative max-w-[1280px] mx-auto px-6 min-h-[92svh] flex flex-col items-center justify-center text-center pt-20 pb-10">
        <TypedHero />
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-[18px] sm:text-[20px] text-slate-500 max-w-[680px] leading-relaxed"
        >
          Coaching centres win exams with endless on-syllabus practice, focused work on weak
          concepts, and total exam familiarity. InfinitySheets puts that training on any
          device&mdash;completely free.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#signup" className="btn-violet inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[16.5px] font-medium shadow-sm">
            Start Free <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#how" className="btn-outline-dark inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[16.5px] font-medium">
            <Play className="w-5 h-5 text-red-600" /> Watch video
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-[760px]"
        >
          {EXAM_TRACKS.map((t) => (
            <a key={t.id} href={`#resources?track=${t.id}`} className="px-4 py-1.5 rounded-full border border-slate-200 bg-white/70 backdrop-blur text-[14px] text-slate-600 hover:border-blue-400 hover:text-blue-700 transition-colors">
              {t.name}
            </a>
          ))}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-[1240px] mx-auto px-6 pb-24"
      >
        <div className="relative rounded-3xl shadow-2xl shadow-blue-900/15 ring-1 ring-slate-900/10">
          <div className="rounded-3xl overflow-hidden">
            <img
              src="/screenshots/dashboard.png"
              alt="The InfinitySheets dashboard showing study streak, daily goal, upcoming exams, and strong and weak topics"
              className="shot-light w-full h-auto block"
              loading="eager"
            />
            <img
              src="/screenshots/dashboard-dark.png"
              alt="The InfinitySheets dashboard in dark mode showing study streak, daily goal, upcoming exams, and strong and weak topics"
              className="shot-dark w-full h-auto block"
              loading="eager"
            />
          </div>
          <CalloutLabels />
        </div>
        {/* Mobile: the same labels as simple links below the screenshot */}
        <div className="md:hidden mt-4 flex flex-wrap justify-center gap-2">
          {CALLOUTS.map((c) => (
            <a key={c.label} href={c.href} className="px-3 py-1.5 rounded-full liquid-glass text-[12.5px] text-slate-700">{c.label}</a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
