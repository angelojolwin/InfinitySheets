import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import InfinityBackground from '../decor/InfinityBackground';
import { DoodleLaptop, DoodleBooks } from '../decor/StudentDoodles';
import { EXAM_TRACKS } from '../../data/mock';

/* Heading typed out character by character; the final segment renders in
   the serif italic. Full text is reserved invisibly so layout never shifts. */
const SEGMENTS = [
  { text: 'A study tool tailored just for ', className: '' },
  { text: 'you', className: 'font-serif-italic' },
  { text: '.', className: '' },
];
const FULL_LEN = SEGMENTS.reduce((n, seg) => n + seg.text.length, 0);

function TypedHero() {
  const [count, setCount] = useState(0);
  const done = count >= FULL_LEN;
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(FULL_LEN); return; }
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), 55);
    return () => clearTimeout(t);
  }, [count, done]);

  let remaining = count;
  return (
    <h1 className="h-display text-[56px] sm:text-[80px] lg:text-[108px] leading-[1.02] max-w-[1080px]" aria-label="A study tool tailored just for you.">
      <span aria-hidden="true" className="relative inline-block">
        <span className="invisible">
          {SEGMENTS.map((seg, i) => <span key={i} className={seg.className}>{seg.text}</span>)}
        </span>
        <span className="absolute inset-0">
          {SEGMENTS.map((seg, i) => {
            const take = Math.max(0, Math.min(seg.text.length, remaining));
            remaining -= take;
            return <span key={i} className={seg.className}>{seg.text.slice(0, take)}</span>;
          })}
          {!done && <span className="type-caret" />}
        </span>
      </span>
    </h1>
  );
}

/* Interactive callouts pinned over the screenshot. Position is % of the
   image box. Hover (or tap) opens the bubble; clicking jumps to the
   matching landing section. */
const CALLOUTS = [
  { x: 56, y: 26, label: 'Study streak', desc: 'Daily streaks and reminders keep practice a habit.', href: '#how', side: 'right' },
  { x: 24, y: 44, label: 'Days until exam', desc: 'Set your exam date and watch the countdown focus you.', href: '#faq', side: 'right' },
  { x: 47, y: 62, label: "Today's goal", desc: 'A daily question goal you can actually hit.', href: '#how', side: 'right' },
  { x: 79, y: 55, label: 'Upcoming exams', desc: 'Per-subject exam dates, always in view.', href: '#faq', side: 'left' },
  { x: 44, y: 82, label: 'Strong & weak topics', desc: 'Every answer sharpens your weakness analysis.', href: '#features', side: 'right' },
  { x: 89, y: 7, label: 'New worksheet', desc: 'Fresh exam-style questions for your syllabus in one click.', href: '#try', side: 'left' },
];

function Callout({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="absolute z-10"
      style={{ left: `${c.x}%`, top: `${c.y}%` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* On touch devices the first tap opens the bubble; the link inside
          navigates. Hover still works on desktop. */}
      <button
        type="button"
        aria-label={`${c.label}: ${c.desc}`}
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={(e) => { if (!e.currentTarget.parentElement.contains(e.relatedTarget)) setOpen(false); }}
        onClick={() => setOpen(true)}
        className="callout-dot block w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-blue-500 ring-2 ring-white cursor-pointer"
      />
      {open && (
        <a
          href={c.href}
          className={`absolute top-1/2 -translate-y-1/2 w-[200px] max-w-[58vw] liquid-glass rounded-xl px-4 py-3 block ${c.side === 'left' ? 'right-6' : 'left-6'}`}
        >
          <div className="text-[13px] font-semibold text-slate-900">{c.label}</div>
          <div className="text-[12px] text-slate-600 mt-0.5 leading-snug">{c.desc}</div>
          <div className="text-[11px] text-blue-600 mt-1.5 font-medium">Learn more &darr;</div>
        </a>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative section-bg overflow-hidden">
      <InfinityBackground variant="hero" />
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="hidden xl:block absolute left-[4%] top-[30%] opacity-90 pointer-events-none"><DoodleBooks width={140} /></div>
      <div className="hidden xl:block absolute right-[4%] top-[24%] opacity-90 pointer-events-none"><DoodleLaptop width={160} /></div>
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-[760px]"
        >
          {EXAM_TRACKS.map((t) => (
            <span key={t.id} className="px-4 py-1.5 rounded-full border border-slate-200 bg-white/70 backdrop-blur text-[14px] text-slate-600">
              {t.name}
            </span>
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
          {CALLOUTS.map((c) => <Callout key={c.label} c={c} />)}
        </div>
      </motion.div>
    </section>
  );
}
