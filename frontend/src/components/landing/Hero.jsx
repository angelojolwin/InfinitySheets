import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import InfinityBackground from '../decor/InfinityBackground';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS } from '../../data/mock';

export default function Hero() {
  const { startDemo } = useApp();
  const onDemo = () => { startDemo(); window.location.hash = '#dashboard'; };
  return (
    <section id="top" className="relative section-bg overflow-hidden">
      <InfinityBackground variant="hero" />
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 min-h-[92svh] flex flex-col items-center justify-center text-center pt-20 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-display text-[52px] sm:text-[72px] lg:text-[96px] leading-[1.02] max-w-[980px]"
        >
          A study tool <span className="font-serif-italic">tailored</span> just for you.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-[17px] sm:text-[19px] text-slate-500 max-w-[640px] leading-relaxed"
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
          <a href="#signup" className="btn-violet inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-medium shadow-sm">
            Start Free <ArrowRight className="w-4 h-4" />
          </a>
          <button onClick={onDemo} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-medium text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors">
            <Eye className="w-4 h-4" /> Try without signing up
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-[720px]"
        >
          {EXAM_TRACKS.map((t) => (
            <span key={t.id} className="px-3 py-1 rounded-full border border-slate-200 bg-white/70 backdrop-blur text-[12.5px] text-slate-600">
              {t.name}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-[1080px] mx-auto px-6 pb-24"
      >
        <div className="absolute inset-x-12 top-6 bottom-16 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative rounded-3xl shadow-2xl shadow-blue-900/15 ring-1 ring-slate-900/10 overflow-hidden">
          <img
            src="/screenshots/dashboard.png"
            alt="The InfinitySheets dashboard showing study streak, daily goal, upcoming exams, and strong and weak topics"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>
        <p className="text-center text-[12.5px] text-slate-400 mt-4">The InfinitySheets dashboard&mdash;a real screenshot, not a mockup.</p>
      </motion.div>
    </section>
  );
}
