import React from 'react';

/*
 * Hand-drawn-style Gen-Z student doodles for the landing page.
 * Line-art with blue accents, matching the site's decor language.
 *
 * Theme-aware: by default the line color follows --doodle-ink /
 * --doodle-paper CSS variables (defined in index.css for light and dark).
 * Pass tone="dark" only for sections that are dark in BOTH themes
 * (e.g. section-dark), where light line-work is always correct.
 *
 * Decorative (aria-hidden); floats gently, sparkles twinkle; both
 * animations are disabled under prefers-reduced-motion.
 */

const ACCENT = '#3b82f6';
const ACCENT_DEEP = '#2563eb';
const ACCENT_SOFT = '#93c5fd';

function palette(tone) {
  if (tone === 'dark') return { s: '#e2e8f0', paper: '#0f172a', skin: '#f1c9a5' };
  return { s: 'var(--doodle-ink, #0f172a)', paper: 'var(--doodle-paper, #ffffff)', skin: '#f1c9a5' };
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

/*
 * Student with headphones working on a stickered laptop at a desk.
 * Three-quarter seated pose: head, neck, hoodie torso, both arms
 * reaching to the keyboard, legs under the desk.
 */
export function DoodleLaptop({ tone = 'light', className = '', width = 170 }) {
  const { s, paper, skin } = palette(tone);
  return (
    <svg viewBox="0 0 220 180" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={178} y={10} s={s} />
      {/* hair: short curly top with taper */}
      <path d="M86 34 q-2 -16 12 -20 q10 -8 24 -2 q12 2 12 14 q2 8 -2 14 l-4 -2 q2 -10 -4 -14 q-12 -8 -24 -2 q-10 2 -10 14 z" stroke={s} strokeWidth="2" fill={ACCENT_DEEP} fillOpacity="0.9" strokeLinejoin="round" />
      {/* head, three-quarter */}
      <path d="M90 42 q0 -14 14 -15 q15 -1 16 13 q1 8 -3 14 q-4 7 -12 7 q-9 0 -13 -8 q-2 -5 -2 -11 z" stroke={s} strokeWidth="2" fill={skin} />
      {/* ear + headphones */}
      <ellipse cx="92" cy="46" rx="3" ry="4" stroke={s} strokeWidth="1.6" fill={skin} />
      <path d="M86 30 q16 -14 34 -2" stroke={s} strokeWidth="2.4" />
      <rect x="84" y="38" width="7" height="13" rx="3.5" stroke={s} strokeWidth="2" fill={ACCENT} />
      <rect x="117" y="36" width="7" height="13" rx="3.5" stroke={s} strokeWidth="2" fill={ACCENT} />
      {/* face: brow, eyes looking at screen, small smile */}
      <path d="M103 42 q3 -2 6 0 M112 42 q3 -2 5 0" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="106" cy="46" r="1.4" fill={s} />
      <circle cx="115" cy="46" r="1.4" fill={s} />
      <path d="M108 54 q3 2.5 6 0" stroke={s} strokeWidth="1.6" strokeLinecap="round" />
      {/* neck */}
      <path d="M102 60 l0 6 M112 60 l0 6" stroke={s} strokeWidth="2" />
      {/* hoodie torso, slight lean toward laptop */}
      <path d="M92 68 q14 -8 30 -2 q10 4 12 16 l4 22 q-30 12 -56 2 l4 -24 q2 -10 6 -14 z" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.95" strokeLinejoin="round" />
      {/* hoodie details: strings + pocket */}
      <path d="M104 68 l1 10 M112 68 l1 10" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M98 98 q12 5 24 0" stroke={s} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      {/* far arm reaching to keyboard */}
      <path d="M130 78 q14 6 14 20 q0 8 -8 12" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M136 110 q-4 5 -10 4" stroke={s} strokeWidth="2" strokeLinecap="round" fill={skin} />
      {/* near arm */}
      <path d="M94 80 q-10 10 -4 22 q3 7 10 8" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M100 110 q4 4 9 3" stroke={s} strokeWidth="2" strokeLinecap="round" />
      {/* laptop: open screen facing student */}
      <path d="M78 116 l58 0 l-6 -26 l-46 0 z" stroke={s} strokeWidth="2.2" fill={paper} strokeLinejoin="round" />
      <path d="M90 96 l34 0 M90 102 l26 0" stroke={ACCENT_SOFT} strokeWidth="2" strokeLinecap="round" />
      <circle cx="120" cy="108" r="3.4" stroke={ACCENT} strokeWidth="1.6" />
      {/* keyboard deck */}
      <path d="M70 116 l74 0 l6 10 l-86 0 z" stroke={s} strokeWidth="2.2" fill={paper} strokeLinejoin="round" />
      {/* desk */}
      <path d="M52 126 L186 126" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M64 126 l-4 42 M172 126 l4 42" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      {/* legs + sneakers under the desk */}
      <path d="M96 126 l-2 26 q0 4 4 4 l10 0 M124 126 l2 26 q0 4 -4 4 l-10 0" stroke={s} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M96 156 q-6 0 -6 5 q0 3 5 3 l14 0 M126 156 q6 0 6 5 q0 3 -5 3 l-14 0" stroke={s} strokeWidth="2" fill={paper} />
      {/* mug on the desk */}
      <path d="M156 112 l12 0 l-1 14 l-10 0 z" stroke={s} strokeWidth="2" fill={paper} />
      <path d="M168 115 q6 0 5 5 q-1 4 -6 3" stroke={s} strokeWidth="1.8" />
      <path d="M160 106 q1 -3 0 -5 M164 106 q1 -3 0 -5" stroke={s} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/*
 * Student carrying a tall stack of textbooks, leaning back slightly to
 * balance it. Full standing figure with jeans and sneakers.
 */
export function DoodleBooks({ tone = 'light', className = '', width = 150 }) {
  const { s, paper, skin } = palette(tone);
  const book = (y, w, tilt, accent) => (
    <g key={y} transform={`rotate(${tilt} 74 ${y + 6})`}>
      <rect x={74 - w / 2} y={y} width={w} height="12" rx="2" stroke={s} strokeWidth="2" fill={accent ? ACCENT : paper} fillOpacity={accent ? 0.85 : 1} />
      <path d={`M${74 - w / 2 + 4} ${y + 6} l${w - 8} 0`} stroke={accent ? '#fff' : s} strokeWidth="1" opacity="0.45" />
    </g>
  );
  return (
    <svg viewBox="0 0 170 190" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={132} y={4} s={s} />
      {/* the stack, balanced with slight tilts */}
      {book(14, 54, -4, false)}
      {book(27, 60, 3, true)}
      {book(40, 56, -2, false)}
      {book(53, 62, 2, false)}
      {book(66, 58, -3, true)}
      {/* head leaning out from behind the stack */}
      <path d="M96 84 q-2 -14 10 -16 q6 -8 16 -4 q10 2 9 14 q3 6 -1 12 l-4 -2 q2 -8 -3 -11 q-3 -8 -12 -6 q-9 -1 -11 8 q-2 3 0 7 z" stroke={s} strokeWidth="2" fill={ACCENT_DEEP} fillOpacity="0.9" strokeLinejoin="round" />
      <path d="M100 88 q1 -12 13 -12 q13 0 13 13 q0 7 -4 11 q-4 5 -10 5 q-7 0 -10 -6 q-2 -5 -2 -11 z" stroke={s} strokeWidth="2" fill={skin} />
      <path d="M107 88 q3 -2 5 0 M116 88 q3 -2 5 0" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="110" cy="92" r="1.4" fill={s} />
      <circle cx="119" cy="92" r="1.4" fill={s} />
      {/* strained grin — carrying a heavy stack */}
      <path d="M110 99 q4 3 8 0" stroke={s} strokeWidth="1.6" strokeLinecap="round" />
      {/* neck + tee torso */}
      <path d="M110 105 l-1 5 M119 105 l1 5" stroke={s} strokeWidth="2" />
      <path d="M100 112 q14 -6 28 0 q6 2 6 10 l-3 24 q-17 7 -34 0 l-3 -24 q0 -8 6 -10 z" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.95" strokeLinejoin="round" />
      {/* arms wrapped around the stack */}
      <path d="M102 114 q-26 -6 -40 -28" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M62 86 q-5 -2 -6 -8" stroke={s} strokeWidth="2" strokeLinecap="round" />
      <path d="M100 126 q-24 -2 -40 -20" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M60 106 q-5 -1 -7 -6" stroke={s} strokeWidth="2" strokeLinecap="round" />
      {/* jeans */}
      <path d="M104 146 l-3 26 l10 0 l3 -22 l4 0 l3 22 l10 0 l-3 -26" stroke={s} strokeWidth="2.2" fill={paper} strokeLinejoin="round" />
      {/* sneakers */}
      <path d="M101 172 q-8 0 -8 6 q0 3 6 3 l14 0 l-1 -9 M128 172 q8 0 8 6 q0 3 -6 3 l-14 0 l1 -9" stroke={s} strokeWidth="2" fill={paper} />
      <path d="M96 177 l8 0 M128 177 l8 0" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
      {/* ground */}
      <path d="M40 184 L150 184" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/*
 * Student sitting cross-legged on the floor, open textbook in their lap,
 * one hand on the page, phone face-down beside them.
 */
export function DoodleReading({ tone = 'light', className = '', width = 170 }) {
  const { s, paper, skin } = palette(tone);
  return (
    <svg viewBox="0 0 210 170" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={14} y={12} s={s} />
      {/* messy bun + hair with side part */}
      <ellipse cx="118" cy="18" rx="8" ry="7" stroke={s} strokeWidth="2" fill={ACCENT_DEEP} fillOpacity="0.9" />
      <path d="M92 48 q-3 -22 18 -24 q21 -2 20 22 q0 5 -2 9 l-4 -2 q2 -4 2 -8 q0 -18 -16 -17 q-15 1 -14 18 q0 4 1 7 l-4 2 q-1 -4 -1 -7 z" stroke={s} strokeWidth="2" fill={ACCENT_DEEP} fillOpacity="0.9" strokeLinejoin="round" />
      {/* head tilted down toward the book */}
      <path d="M96 50 q1 -14 15 -14 q14 0 14 14 q0 8 -5 13 q-4 5 -10 4 q-8 0 -12 -7 q-2 -4 -2 -10 z" stroke={s} strokeWidth="2" fill={skin} />
      {/* eyes looking down at the page */}
      <path d="M103 50 q3 -2 5 0 M112 50 q3 -2 5 0" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M105 55 q1.5 1.5 3 0 M114 55 q1.5 1.5 3 0" stroke={s} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M108 62 q3 2 6 0" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
      {/* neck */}
      <path d="M106 66 l0 5 M115 66 l0 5" stroke={s} strokeWidth="2" />
      {/* hoodie torso, hunched forward */}
      <path d="M94 74 q16 -8 32 -1 q8 4 9 14 l3 20 q-28 12 -54 1 l3 -21 q1 -9 7 -13 z" stroke={s} strokeWidth="2.2" fill={ACCENT} fillOpacity="0.95" strokeLinejoin="round" />
      <path d="M107 74 l1 8 M115 74 l1 8" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
      {/* arms down to the book, hands on pages */}
      <path d="M94 82 q-12 12 -5 26 q2 5 8 7" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="99" cy="117" rx="4" ry="3" stroke={s} strokeWidth="1.8" fill={skin} />
      <path d="M128 84 q12 12 5 26 q-2 5 -8 6" stroke={s} strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="123" cy="117" rx="4" ry="3" stroke={s} strokeWidth="1.8" fill={skin} />
      {/* open textbook resting in lap */}
      <path d="M80 112 q30 -14 31 0 q1 -14 31 0 l0 18 q-30 -12 -31 0 q-1 -12 -31 0 z" stroke={s} strokeWidth="2.2" fill={paper} strokeLinejoin="round" />
      <path d="M88 116 q14 -6 17 -3 M117 113 q14 -6 17 -3 M88 122 q12 -5 15 -3" stroke={ACCENT_SOFT} strokeWidth="1.7" strokeLinecap="round" />
      {/* crossed legs in joggers */}
      <path d="M78 138 q10 -12 30 -10 q6 1 10 4 q8 -8 24 -4 q10 3 12 10 q-20 12 -40 6 q-20 8 -36 -6 z" stroke={s} strokeWidth="2.2" fill={paper} strokeLinejoin="round" />
      {/* tucked sneakers */}
      <path d="M124 142 q10 -2 14 3 q2 4 -4 5 l-12 1" stroke={s} strokeWidth="2" fill={paper} />
      {/* phone face-down on the floor — no distractions */}
      <rect x="164" y="130" width="13" height="22" rx="3" transform="rotate(12 170 141)" stroke={s} strokeWidth="2" fill={paper} />
      <circle cx="170" cy="148" r="1.3" fill={s} />
      {/* ground */}
      <path d="M58 156 L182 156" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
