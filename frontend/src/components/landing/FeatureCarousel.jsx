import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../../data/mock';
import { FeatureDemo, DEMO_KINDS } from './Features';

/*
 * The six feature cards arranged on a slowly spinning 3D ring, shown in
 * the hero between the exam-track chips and the dashboard screenshot.
 * Hovering pauses the spin so a card can be read; backfaces are hidden so
 * cards passing behind never render mirrored. Reduced-motion users get a
 * static, slightly angled ring.
 */
export default function FeatureCarousel() {
  const n = FEATURES.length;
  // Card width 250px on a hexagonal ring → radius keeps ~40px gaps.
  const radius = 300;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="carousel3d-stage mt-14 mb-2 hidden sm:flex justify-center"
      aria-label="InfinitySheets features"
    >
      <div className="carousel3d-ring">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="carousel3d-card"
            style={{ transform: `rotateY(${(360 / n) * i}deg) translateZ(${radius}px)` }}
          >
            <div className="feature-card min-h-full liquid-glass rounded-2xl px-5 py-4 text-left flex flex-col">
              <div className="feature-demo">
                <FeatureDemo kind={DEMO_KINDS[i] || 'fresh'} />
              </div>
              <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{f.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed line-clamp-4">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
