import React from 'react';
import { Check, X } from 'lucide-react';
import Reveal from './Reveal';

const COMPARISON = [
  { them: 'Answers only what you ask', us: 'Decides what you should practice next' },
  { them: 'Forgets you between sessions', us: 'Remembers every answer you have ever given' },
  { them: 'Drifts away from your syllabus', us: 'Sticks to your exact curriculum and exam board' },
  { them: 'Free-form chat, no exam realism', us: 'Real exam formats, timing, and mark schemes' },
  { them: 'You track your own progress', us: 'Accurate scores and predicted grades, automatically' },
];

export default function WhyDifferent() {
  return (
    <section className="section-dark overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-36 min-h-[80svh] flex flex-col justify-center">
        <Reveal>
          <div className="text-center max-w-[860px] mx-auto">
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-blue-300 mb-5">Why InfinitySheets?</div>
            <h2 className="h-display text-white text-[44px] sm:text-[60px] lg:text-[72px] leading-[1.05]">
              Studying shouldn&rsquo;t be guesswork.
            </h2>
            <p className="mt-7 text-[16.5px] sm:text-[18px] leading-relaxed text-slate-300 max-w-[720px] mx-auto">
              Most students don&rsquo;t fail for lack of effort&mdash;they study blind. Rereading notes explains
              concepts, but it never shows you which questions you&rsquo;d miss or how the exam will actually
              ask them. InfinitySheets finds your weak concepts, drills them with exam-style practice,
              and shows your score climbing&mdash;so every hour you put in pays off.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-16 max-w-[920px] mx-auto w-full">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/50 backdrop-blur overflow-hidden">
              <div className="grid grid-cols-2 border-b border-slate-700">
                <div className="px-6 py-4 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">A chatbot</div>
                <div className="px-6 py-4 text-[13px] font-semibold text-blue-300 uppercase tracking-wider border-l border-slate-700">InfinitySheets</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={i} className={`grid grid-cols-2 ${i > 0 ? 'border-t border-slate-800' : ''}`}>
                  <div className="px-6 py-4 flex items-start gap-3">
                    <X className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                    <span className="text-[14px] text-slate-400 leading-snug">{row.them}</span>
                  </div>
                  <div className="px-6 py-4 flex items-start gap-3 border-l border-slate-800">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.6} />
                    <span className="text-[14px] text-slate-100 leading-snug">{row.us}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[920px] mx-auto w-full">
            <Mini label="Adaptive" value="to your level" />
            <Mini label="Personalized" value="to your weak spots" />
            <Mini label="Instant" value="feedback & marking" />
            <Mini label="Free" value="every feature, no paywall" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3">
      <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-400">{label}</div>
      <div className="text-[14px] text-slate-100 mt-1">{value}</div>
    </div>
  );
}
