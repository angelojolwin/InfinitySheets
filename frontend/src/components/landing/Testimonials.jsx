import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/mock';

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-5">Testimonials</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[54px]">Loved by students who stopped guessing.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card-soft p-6">
              <Quote className="w-5 h-5 text-blue-400 mb-3" />
              <p className="text-[15.5px] font-medium text-slate-900 leading-snug">{t.quote}</p>
              <div className="mt-6 pt-5 border-t border-[color:var(--color-border)] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-[12px] font-semibold text-blue-700">{t.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}</div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-slate-800">{t.name}</div>
                  <div className="text-[12px] text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
