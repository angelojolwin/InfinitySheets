import React from 'react';

export default function WhyInfinity() {
  return (
    <section className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">
        <div>
          <div className="eyebrow mb-5">Why InfinitySheets?</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[54px]">
            Studying shouldn’t be guesswork.
          </h2>
        </div>
        <div className="lg:pt-3">
          <p className="text-[16.5px] leading-relaxed text-slate-600">
            Most students don't fail for lack of effort—they study blind. Rereading notes explains concepts, but it never shows you which questions you'd miss or how the exam will actually ask them. InfinitySheets finds your weak concepts, drills them with exam-style practice, and shows your score climbing—so every hour you put in pays off.
          </p>
          <p className="mt-5 text-[16.5px] leading-relaxed text-slate-600">
            And unlike a chatbot, it doesn't just answer what you ask. It remembers every answer you've given, tracks your weaknesses over time, sticks to your syllabus, matches real exam formats, and decides what you should practice next.
          </p>
        </div>
      </div>
    </section>
  );
}
