import React from 'react';
import { HOW_IT_WORKS } from '../../data/mock';
import Reveal from './Reveal';

export default function HowItWorks() {
  return (
    <section id="how" className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-36 min-h-[85svh] flex flex-col justify-center">
        <Reveal>
          <div className="text-center max-w-[820px] mx-auto">
            <div className="eyebrow mb-5">How it works</div>
            <h2 className="h-display text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.05]">From your first worksheet to mastery.</h2>
            <p className="mt-5 text-[16px] text-slate-500 leading-relaxed max-w-[640px] mx-auto">
              A simple loop that adapts to you. Every step feeds the next, so practice becomes more targeted with time.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 max-w-[880px] mx-auto w-full flex flex-col gap-5">
          {HOW_IT_WORKS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="card-soft px-7 py-6 flex items-start gap-6 hover:shadow-lg hover:shadow-slate-900/5 transition-shadow">
                <div className="shrink-0 text-[40px] sm:text-[48px] font-semibold tracking-tight text-blue-200 leading-none tabular-nums select-none">{s.n}</div>
                <div className="min-w-0 pt-1">
                  <div className="text-[18px] sm:text-[20px] font-semibold text-slate-900">{s.title}</div>
                  <p className="text-[14.5px] sm:text-[15px] text-slate-600 mt-1.5 leading-relaxed">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
