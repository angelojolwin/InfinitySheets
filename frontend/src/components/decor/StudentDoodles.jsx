import React from 'react';

/*
 * Hand-drawn-style Gen-Z student doodles for the landing page.
 * Line-art with blue accents, matching the site's decor language.
 * `tone="dark"` renders white line-work for dark sections.
 * All are decorative (aria-hidden) and float gently; animation is
 * disabled under prefers-reduced-motion (see .doodle-float in index.css).
 */

const ACCENT = '#3b82f6';
const ACCENT_SOFT = '#93c5fd';

function ink(tone) {
  return tone === 'dark' ? '#e2e8f0' : '#0f172a';
}

function Sparkles({ x = 0, y = 0, s }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={s} strokeWidth="1.6" strokeLinecap="round" className="doodle-twinkle">
      <path d="M6 0 L6 12 M0 6 L12 6" />
      <path d="M26 14 L26 22 M22 18 L30 18" opacity="0.7" />
      <circle cx="14" cy="26" r="1.4" fill={s} stroke="none" />
    </g>
  );
}

/* Student with headphones hammering away at a stickered laptop */
export function DoodleLaptop({ tone = 'light', className = '', width = 170 }) {
  const s = ink(tone);
  return (
    <svg viewBox="0 0 200 150" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={158} y={8} s={s} />
      {/* hair — curly mop */}
      <path d="M78 38 q-8 -18 10 -22 q4 -10 16 -8 q12 -4 16 6 q12 2 8 16 q6 8 -4 14" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.9" />
      {/* head */}
      <ellipse cx="98" cy="42" rx="16" ry="17" stroke={s} strokeWidth="2.2" />
      {/* face */}
      <circle cx="93" cy="42" r="1.5" fill={s} />
      <circle cx="104" cy="42" r="1.5" fill={s} />
      <path d="M95 50 q4 4 9 0" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
      {/* headphones */}
      <path d="M80 36 q-6 0 -5 8 q1 6 7 5" stroke={s} strokeWidth="2.4" />
      <path d="M116 36 q6 0 5 8 q-1 6 -7 5" stroke={s} strokeWidth="2.4" />
      <path d="M80 34 q18 -16 36 0" stroke={s} strokeWidth="2.4" />
      {/* torso — tee */}
      <path d="M84 60 q14 -6 28 0 l6 26 q-20 8 -40 0 z" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.95" />
      {/* arms typing */}
      <path d="M84 64 q-14 8 -6 22 q4 6 12 4" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M112 64 q14 8 8 22 q-3 6 -11 4" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      {/* laptop */}
      <path d="M70 96 l56 0 l6 22 l-68 0 z" stroke={s} strokeWidth="2.2" fill={tone === 'dark' ? '#0f172a' : '#fff'} />
      <path d="M76 100 l44 0" stroke={ACCENT_SOFT} strokeWidth="2" strokeLinecap="round" />
      {/* laptop sticker */}
      <circle cx="98" cy="108" r="4" stroke={ACCENT} strokeWidth="1.8" />
      {/* desk line */}
      <path d="M54 118 L146 118" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
      {/* bolt above screen = fast */}
      <path d="M124 84 l-5 8 h5 l-5 8" stroke={s} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Student peeking past a huge stack of textbooks */
export function DoodleBooks({ tone = 'light', className = '', width = 150 }) {
  const s = ink(tone);
  const book = (y, w, tilt = 0) => (
    <g key={y} transform={`rotate(${tilt} 70 ${y + 5})`}>
      <rect x={70 - w / 2} y={y} width={w} height="11" rx="2" stroke={s} strokeWidth="2" fill={tone === 'dark' ? '#0f172a' : '#fff'} />
      <path d={`M${70 - w / 2 + 5} ${y + 5.5} l${w - 10} 0`} stroke={s} strokeWidth="1" opacity="0.4" />
    </g>
  );
  return (
    <svg viewBox="0 0 170 160" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={132} y={6} s={s} />
      {/* stack of textbooks */}
      {book(18, 56, -3)}
      {book(30, 62, 2)}
      {book(42, 58, -1)}
      {book(54, 64, 1)}
      {book(66, 60, -2)}
      {/* head peeking from the right */}
      <path d="M118 74 q-4 -14 8 -16 q10 -8 20 0 q10 4 6 16" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.9" />
      <ellipse cx="132" cy="80" rx="14" ry="15" stroke={s} strokeWidth="2.2" />
      <circle cx="128" cy="79" r="1.5" fill={s} />
      <circle cx="138" cy="79" r="1.5" fill={s} />
      <path d="M129 87 q4 3.5 8 0" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
      {/* body + arms hugging the stack */}
      <path d="M120 96 q12 -5 24 0 l-4 34 q-9 4 -17 0 z" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.95" />
      <path d="M120 100 q-24 -4 -42 -18" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M118 112 q-22 0 -40 -12" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      {/* sneakers */}
      <path d="M124 132 q-2 8 6 8 M138 132 q2 8 -6 8" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      {/* ground */}
      <path d="M44 146 L150 146" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* Student sitting cross-legged, textbook in lap, phone on the floor */
export function DoodleReading({ tone = 'light', className = '', width = 170 }) {
  const s = ink(tone);
  return (
    <svg viewBox="0 0 200 150" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={16} y={10} s={s} />
      {/* bun + hair */}
      <circle cx="106" cy="18" r="7" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.9" />
      <path d="M84 44 q-4 -20 16 -20 q20 0 16 20" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.9" />
      {/* head */}
      <ellipse cx="100" cy="44" rx="15" ry="16" stroke={s} strokeWidth="2.2" />
      <circle cx="95" cy="45" r="1.5" fill={s} />
      <circle cx="106" cy="45" r="1.5" fill={s} />
      <path d="M97 52 q4 3.5 8 0" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
      {/* hoodie torso */}
      <path d="M86 62 q14 -7 28 0 l8 28 q-22 10 -44 0 z" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.95" />
      <path d="M96 62 q4 6 8 0" stroke={s} strokeWidth="1.8" />
      {/* arms to book */}
      <path d="M86 68 q-12 12 -2 24" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M114 68 q12 12 2 24" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      {/* open textbook */}
      <path d="M74 96 q26 -12 26 0 q0 -12 26 0 l0 16 q-26 -10 -26 0 q0 -10 -26 0 z" stroke={s} strokeWidth="2.2" fill={tone === 'dark' ? '#0f172a' : '#fff'} />
      <path d="M82 100 q12 -5 14 -2 M104 98 q12 -5 14 -2" stroke={ACCENT_SOFT} strokeWidth="1.8" strokeLinecap="round" />
      {/* crossed legs */}
      <path d="M74 122 q26 -14 52 0 q-26 12 -52 0" stroke={s} strokeWidth="2.2" fill={tone === 'dark' ? '#0f172a' : '#fff'} />
      {/* phone on the floor */}
      <rect x="146" y="116" width="12" height="20" rx="2.5" transform="rotate(14 152 126)" stroke={s} strokeWidth="2" />
      {/* ground */}
      <path d="M56 138 L160 138" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
