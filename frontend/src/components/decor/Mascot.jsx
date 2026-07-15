import React from 'react';

/*
 * Sheety — the InfinitySheets mascot: a chibi robot in a navy hoodie with
 * a glowing infinity face (vector recreation of the brand character).
 * Poses: "wave" (arm up, waving), "peek" (head + hands over an edge),
 * "sit" (legs dangling — perch him on a card edge), "float" (airborne
 * with sparkles). All motion is CSS-driven and respects reduced motion.
 *
 * Palette: #0D1B2A ink · #1E3A8A navy · #3B82F6 blue · #A5D8FF ice · #fff
 */

function Head({ cx = 60, cy = 44 }) {
  return (
    <g>
      {/* hair tuft */}
      <path d={`M${cx - 14} ${cy - 32} q6 -12 12 -4 q2 -10 8 -6 q6 -6 8 2 l-4 10 z`} fill="#0D1B2A" />
      {/* ear pods */}
      <circle cx={cx - 31} cy={cy} r="7.5" fill="#1E3A8A" stroke="#0D1B2A" strokeWidth="1.5" />
      <circle cx={cx + 31} cy={cy} r="7.5" fill="#1E3A8A" stroke="#0D1B2A" strokeWidth="1.5" />
      {/* helmet shell */}
      <rect x={cx - 30} y={cy - 28} width="60" height="52" rx="20" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
      {/* visor */}
      <rect x={cx - 24} y={cy - 21} width="48" height="38" rx="14" fill="#0D1B2A" />
      {/* glowing infinity */}
      <g className="mascot-glow">
        <path
          d={`M${cx - 11} ${cy - 6} c-5 -6 -13 0 -8 6 c5 6 13 0 8 -6 c5 -6 13 0 8 6 c5 6 13 0 8 -6`}
          transform={`translate(2 2)`}
          fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"
        />
        {/* smile eyes */}
        <path d={`M${cx - 16} ${cy + 9} q4 4 8 0`} fill="none" stroke="#A5D8FF" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M${cx + 8} ${cy + 9} q4 4 8 0`} fill="none" stroke="#A5D8FF" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Sparkles({ cx = 60 }) {
  return (
    <g className="mascot-sparkle" fill="#3B82F6" aria-hidden="true">
      <path d={`M${cx - 44} 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z`} opacity="0.8" />
      <path d={`M${cx + 42} 14 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 z`} opacity="0.6" />
      <path d={`M${cx + 48} 60 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z`} opacity="0.7" />
    </g>
  );
}

export default function Mascot({ pose = 'wave', width = 90, className = '' }) {
  if (pose === 'peek') {
    // Head + gloves gripping an edge; place at the top edge of a card.
    return (
      <svg viewBox="0 0 120 62" width={width} className={className} aria-hidden="true">
        <Head cx={60} cy={40} />
        <ellipse cx="24" cy="58" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        <ellipse cx="96" cy="58" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
      </svg>
    );
  }

  if (pose === 'sit') {
    return (
      <svg viewBox="0 0 120 128" width={width} className={className} aria-hidden="true">
        <Head cx={60} cy={38} />
        {/* hoodie body */}
        <path d="M38 66 q22 -10 44 0 l4 28 q-26 8 -52 0 z" fill="#1E3A8A" stroke="#0D1B2A" strokeWidth="2" />
        <path d="M52 74 c-4 -5 -12 0 -7 5 c4 5 11 0 7 -5 c4 -5 11 0 7 5 c5 5 12 0 8 -5" transform="translate(4 4)" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        {/* arms resting */}
        <ellipse cx="34" cy="88" rx="8" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        <ellipse cx="86" cy="88" rx="8" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        {/* dangling legs */}
        <g className="mascot-leg-l">
          <rect x="44" y="94" width="12" height="22" rx="6" fill="#0D1B2A" />
          <ellipse cx="50" cy="120" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        </g>
        <g className="mascot-leg-r">
          <rect x="64" y="94" width="12" height="22" rx="6" fill="#0D1B2A" />
          <ellipse cx="70" cy="120" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  if (pose === 'float') {
    return (
      <svg viewBox="0 0 120 132" width={width} className={`mascot-bob ${className}`} aria-hidden="true">
        <Sparkles cx={60} />
        <Head cx={60} cy={40} />
        <path d="M40 68 q20 -9 40 0 l3 26 q-23 7 -46 0 z" fill="#1E3A8A" stroke="#0D1B2A" strokeWidth="2" />
        <path d="M53 76 c-4 -5 -11 0 -7 5 c4 5 11 0 7 -5 c4 -5 11 0 7 5 c4 5 11 0 7 -5" transform="translate(3 3)" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        <ellipse cx="34" cy="82" rx="8" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        <ellipse cx="86" cy="82" rx="8" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        {/* tucked feet */}
        <ellipse cx="50" cy="102" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
        <ellipse cx="70" cy="102" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
      </svg>
    );
  }

  // default: wave — one arm raised and waving
  return (
    <svg viewBox="0 0 130 128" width={width} className={className} aria-hidden="true">
      <Head cx={62} cy={44} />
      <path d="M42 72 q20 -9 40 0 l3 26 q-23 7 -46 0 z" fill="#1E3A8A" stroke="#0D1B2A" strokeWidth="2" />
      <path d="M55 80 c-4 -5 -11 0 -7 5 c4 5 11 0 7 -5 c4 -5 11 0 7 5 c4 5 11 0 7 -5" transform="translate(3 3)" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      {/* resting arm */}
      <ellipse cx="38" cy="92" rx="8" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
      {/* waving arm */}
      <g className="mascot-wave-arm">
        <rect x="92" y="52" width="9" height="26" rx="4.5" fill="#1E3A8A" stroke="#0D1B2A" strokeWidth="1.5" />
        <ellipse cx="97" cy="48" rx="9" ry="7" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
      </g>
      {/* feet */}
      <ellipse cx="54" cy="106" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
      <ellipse cx="74" cy="106" rx="9" ry="6" fill="#fff" stroke="#0D1B2A" strokeWidth="2" />
    </svg>
  );
}
