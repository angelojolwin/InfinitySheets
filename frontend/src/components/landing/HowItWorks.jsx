import React from 'react';
import { HOW_IT_WORKS } from '../../data/mock';
import { ArrowDown } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="how" className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-5">How it works</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[54px]">From your first worksheet to mastery.</h2>
          <p className="mt-5 text-[15.5px] text-slate-500 leading-relaxed max-w-[640px]">
            A simple loop that adapts to you. Every step feeds the next, so practice becomes more targeted with time.
          </p>
        </div>
        <div className="mt-12 max-w-[820px] mx-auto flex flex-col items-stretch gap-4">
          {HOW_IT_WORKS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="card-soft px-5 py-5 flex items-start gap-5">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[14px] tabular-nums">{s.n}</div>
                <div className="min-w-0">
                  <div className="text-[16px] font-semibold text-slate-900">{s.title}</div>
                  <p className="text-[14px] text-slate-600 mt-1 leading-relaxed">{s.text}</p>
                </div>
              </div>
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="flex justify-center text-slate-400">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
