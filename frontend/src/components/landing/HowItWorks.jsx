import React, { useState } from 'react';
import { HOW_IT_WORKS } from '../../data/mock';
import { ArrowDown } from 'lucide-react';
import Reveal from './Reveal';
import { DoodleLaptop, DoodleStationery } from '../decor/StudyDoodles';

/* Animated vignettes — one looping "gif" per step, drawn in SVG so they
   stay crisp and theme-aware. The cursor really clicks, bars really scan. */

function Cursor({ x, y }) {
  return (
    <g className="demo-cursor" transform={`translate(${x} ${y})`}>
      <path d="M0 0 L0 15 L4 11.5 L7 18 L9.5 17 L6.7 10.5 L11.5 10 Z" fill="#0f172a" stroke="#fff" strokeWidth="1.2" />
    </g>
  );
}

function StepDemo({ step }) {
  const card = { fill: 'var(--doodle-paper, #fff)', stroke: '#cbd5e1' };
  const ink = 'var(--doodle-ink, #0f172a)';
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden="true">
      {step === 0 && (
        <g>
          {/* worksheet card with a submit button being clicked */}
          <rect x="40" y="20" width="240" height="140" rx="12" {...card} strokeWidth="1.5" />
          <rect x="58" y="38" width="150" height="10" rx="5" fill="#93c5fd" />
          <rect x="58" y="60" width="200" height="7" rx="3.5" fill="#e2e8f0" />
          <rect x="58" y="74" width="180" height="7" rx="3.5" fill="#e2e8f0" />
          <rect x="58" y="96" width="120" height="16" rx="8" fill="#dbeafe" />
          <g className="demo-press">
            <rect x="58" y="126" width="118" height="24" rx="8" fill="#3b82f6" />
            <text x="117" y="142" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">Submit worksheet</text>
          </g>
          <Cursor x={150} y={140} />
        </g>
      )}
      {step === 1 && (
        <g>
          {/* topic bars being scanned; weak one flags red */}
          <rect x="40" y="20" width="240" height="150" rx="12" {...card} strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="58" y={42 + i * 30} width="80" height="8" rx="4" fill="#e2e8f0" />
              <rect x="150" y={40 + i * 30} width="110" height="12" rx="6" fill="#eff6ff" />
              <rect x="150" y={40 + i * 30} width={[95, 60, 30, 80][i]} height="12" rx="6" fill={i === 2 ? '#f87171' : '#60a5fa'} />
            </g>
          ))}
          <rect x="146" y="28" width="4" height="130" rx="2" fill="#3b82f6" opacity="0.55" className="demo-scan" />
          <g className="demo-pop">
            <rect x="196" y="92" width="70" height="20" rx="10" fill="#fee2e2" stroke="#f87171" strokeWidth="1.2" />
            <text x="231" y="106" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="600">weak spot</text>
          </g>
        </g>
      )}
      {step === 2 && (
        <g>
          {/* new targeted worksheet sliding in on top of old ones */}
          <rect x="66" y="46" width="200" height="120" rx="12" fill="#e2e8f0" opacity="0.6" />
          <rect x="54" y="34" width="200" height="120" rx="12" fill="#e2e8f0" opacity="0.85" />
          <g className="demo-slide">
            <rect x="42" y="22" width="200" height="120" rx="12" {...card} strokeWidth="1.5" />
            <rect x="58" y="40" width="90" height="16" rx="8" fill="#fee2e2" />
            <text x="103" y="52" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="600">Trigonometry</text>
            <rect x="58" y="68" width="160" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="58" y="82" width="140" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="58" y="96" width="150" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="58" y="116" width="76" height="18" rx="9" fill="#3b82f6" />
            <text x="96" y="129" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">Start</text>
          </g>
        </g>
      )}
      {step === 3 && (
        <g>
          {/* recommendation card popping in */}
          <rect x="40" y="30" width="240" height="130" rx="12" {...card} strokeWidth="1.5" />
          <rect x="58" y="48" width="120" height="10" rx="5" fill="#93c5fd" />
          <g className="demo-pop">
            <rect x="58" y="74" width="204" height="60" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.2" />
            <circle cx="80" cy="104" r="10" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.4" />
            <text x="80" y="108" textAnchor="middle" fontSize="11">&#128161;</text>
            <text x="100" y="99" fontSize="10.5" fill={ink} fontWeight="600">Next: 10 questions on</text>
            <text x="100" y="113" fontSize="10.5" fill="#2563eb" fontWeight="600">Electrostatics &middot; Medium</text>
          </g>
        </g>
      )}
      {step === 4 && (
        <g>
          {/* progress chart drawing itself upward */}
          <rect x="40" y="20" width="240" height="150" rx="12" {...card} strokeWidth="1.5" />
          {[60, 95, 130].map((y) => <line key={y} x1="58" x2="262" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 5" />)}
          <path d="M60 145 L95 132 L128 138 L162 112 L196 100 L230 78 L258 60" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" className="demo-draw" />
          <g className="demo-pop">
            <rect x="196" y="34" width="66" height="20" rx="10" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.2" />
            <text x="229" y="48" textAnchor="middle" fontSize="10" fill="#15803d" fontWeight="600">+42%</text>
          </g>
        </g>
      )}
    </svg>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  return (
    <section id="how" className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-20 lg:py-28">
        <Reveal>
          <div className="relative text-center max-w-[860px] mx-auto">
            <div className="eyebrow mb-5">How it works</div>
            <h2 className="h-display text-[46px] sm:text-[60px] lg:text-[70px] leading-[1.05]">From your first worksheet to mastery.</h2>
            <p className="mt-6 text-[17px] sm:text-[18px] text-slate-500 leading-relaxed max-w-[680px] mx-auto">
              A simple loop that adapts to you. Every step feeds the next, so practice becomes more targeted with time.
            </p>
            <div className="hidden lg:block absolute -left-48 top-8"><DoodleLaptop /></div>
            <div className="hidden lg:block absolute -right-44 top-16"><DoodleStationery /></div>
          </div>
        </Reveal>
        <div className="mt-16 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start max-w-[1100px] mx-auto w-full">
          {/* Steps on the left */}
          <div className="flex flex-col">
            {HOW_IT_WORKS.map((s, i) => (
              <React.Fragment key={s.n}>
                <Reveal delay={i * 0.05}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`w-full text-left liquid-glass rounded-2xl px-6 py-5 flex items-start gap-5 transition-all ${active === i ? 'ring-2 ring-blue-400/60' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <div className={`shrink-0 text-[34px] font-semibold tracking-tight leading-none tabular-nums select-none ${active === i ? 'text-blue-500' : 'text-blue-300'}`}>{s.n}</div>
                    <div className="min-w-0 pt-0.5">
                      <div className="text-[17px] font-semibold text-slate-900">{s.title}</div>
                      <p className="text-[14px] text-slate-600 mt-1 leading-relaxed">{s.text}</p>
                    </div>
                  </button>
                </Reveal>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="flex justify-center py-1.5 text-blue-400">
                    <ArrowDown className="w-5 h-5" strokeWidth={2.4} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Live demo of the active step on the right */}
          <Reveal delay={0.15}>
            <div className="lg:sticky lg:top-24">
              <div className="liquid-glass rounded-3xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] tracking-wider uppercase font-semibold text-slate-500">
                    Step {HOW_IT_WORKS[active].n} &middot; {HOW_IT_WORKS[active].title}
                  </span>
                  <span className="flex gap-1.5">
                    {HOW_IT_WORKS.map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === active ? 'bg-blue-500' : 'bg-slate-300'}`} />
                    ))}
                  </span>
                </div>
                <StepDemo step={active} />
                <p className="text-[12px] text-slate-400 mt-2 text-center">Hover a step to see it in action.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
