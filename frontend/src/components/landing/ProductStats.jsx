import React from 'react';
import { EXAM_TRACKS, SUBJECTS } from '../../data/mock';

// Honest product facts (not user counts — the product is pre-launch).
const subjectCount = new Set(Object.values(SUBJECTS).flat()).size;

const STATS = [
  { value: `${EXAM_TRACKS.length}`, label: 'curricula covered' },
  { value: `${subjectCount}+`, label: 'subjects' },
  { value: 'Unlimited', label: 'exam-style questions' },
  { value: '$0', label: 'forever' },
];

export default function ProductStats() {
  return (
    <section aria-label="At a glance" className="section-bg border-y border-[color:var(--color-border)]">
      <div className="max-w-[1100px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-slate-900">{s.value}</div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
