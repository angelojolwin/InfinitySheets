import React from 'react';
import { Check } from 'lucide-react';
import { PRICING } from '../../data/mock';

export default function Pricing() {
  return (
    <section id="pricing" className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-5">Pricing</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[54px]">Start free. Upgrade when you’re ready.</h2>
          <p className="mt-5 text-[15.5px] text-slate-500 leading-relaxed max-w-[560px]">
            Begin with everything you need to study smarter. Premium unlocks unlimited practice and deeper analytics.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 max-w-[860px]">
          {PRICING.map((p) => (
            <div key={p.tag} className={`rounded-2xl p-7 ${p.highlight ? 'bg-slate-900 text-white border border-slate-800' : 'card-soft'}`}>
              <div className={`text-[11px] tracking-[0.14em] uppercase font-semibold ${p.highlight ? 'text-blue-300' : 'text-blue-600'}`}>{p.tag}</div>
              <div className="flex items-baseline gap-1 mt-3">
                <div className={`text-[36px] font-semibold tracking-tight ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</div>
                <div className={`text-[13px] ${p.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{p.period}</div>
              </div>
              <ul className="mt-5 flex flex-col gap-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 mt-0.5 ${p.highlight ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={2.6} />
                    <span className={`text-[14px] ${p.highlight ? 'text-slate-200' : 'text-slate-700'}`}>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#signup" className={`mt-6 inline-flex items-center justify-center w-full py-2.5 rounded-lg text-[14px] font-medium transition-colors ${p.highlight ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'btn-violet'}`}>{p.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
