import React from 'react';
import { Infinity } from 'lucide-react';

export default function WhatIs() {
  return (
    <section className="section-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-7 h-7 rounded-md bg-blue-500/20 flex items-center justify-center">
              <Infinity className="w-4 h-4 text-blue-300" strokeWidth={2.4} />
            </span>
            <span className="text-[11px] tracking-[0.14em] uppercase font-semibold text-blue-300">What is InfinitySheets?</span>
          </div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[54px] text-white">
            An AI-powered platform that creates personalized revision for every student.
          </h2>
        </div>
        <div className="lg:pt-3 flex flex-col gap-5">
          <p className="text-[16px] leading-relaxed text-slate-300">
            Instead of using the same worksheets for everyone, InfinitySheets continuously adapts to your strengths and weaknesses. Every worksheet, recommendation, and progress report is generated specifically for you, making every study session more effective.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Mini label="Adaptive" value="to your level" />
            <Mini label="Personalized" value="to your weak spots" />
            <Mini label="Instant" value="feedback & marking" />
            <Mini label="Local" value="saved on your device" />
          </div>
        </div>
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
