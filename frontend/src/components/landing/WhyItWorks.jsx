import React from 'react';
import { Check } from 'lucide-react';
import { WHY_IT_WORKS } from '../../data/mock';

export default function WhyItWorks() {
  return (
    <section className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
        <div>
          <div className="eyebrow mb-5">Why it works</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[54px]">Built on how students actually learn.</h2>
          <p className="mt-5 max-w-[480px] text-[15.5px] text-slate-500 leading-relaxed">
            Active recall, spaced repetition, and adaptive practice are the backbone of better revision. We just put them in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 self-center">
          {WHY_IT_WORKS.map((p) => (
            <div key={p} className="card-soft px-4 py-4 flex items-start gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-4 h-4" strokeWidth={2.6} />
              </span>
              <span className="text-[14.5px] text-slate-800 font-medium leading-snug">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
