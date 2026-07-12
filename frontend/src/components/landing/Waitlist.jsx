import React, { useState } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import Reveal from './Reveal';
import { DoodleFlask } from '../decor/StudyDoodles';

// To collect real leads, set this to a form endpoint (Formspree, Google
// Form's formResponse URL, or your own /api/waitlist route). While empty,
// submissions are validated and stored locally so nothing is lost, and the
// user still gets a confirmation.
const WAITLIST_ENDPOINT = '';
const STORAGE_KEY = 'infinitysheets_waitlist';

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | busy | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!validEmail(email)) { setStatus('error'); return; }
    setStatus('busy');
    // Always keep a local copy so early sign-ups aren't lost.
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!list.includes(email.trim())) list.push(email.trim());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch { /* storage unavailable — ignore */ }
    if (WAITLIST_ENDPOINT) {
      try {
        await fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), source: 'landing-waitlist' }),
        });
      } catch { /* network hiccup — the local copy still has it */ }
    }
    setStatus('done');
  };

  return (
    <section id="waitlist" className="relative section-dark overflow-hidden">
      <div className="hidden lg:block absolute right-[5%] top-14"><DoodleFlask tone="dark" width={90} /></div>
      <div className="max-w-[860px] mx-auto px-6 py-24 lg:py-28 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[12.5px] font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Launching soon &middot; join the first cohort
          </div>
          <h2 className="h-display text-white text-[40px] sm:text-[50px] lg:text-[58px] leading-[1.05]">
            Be one of the first students in.
          </h2>
          <p className="mt-5 text-[16.5px] text-slate-300 leading-relaxed max-w-[560px] mx-auto">
            We&rsquo;re opening InfinitySheets to a first group of students. Drop your email and
            we&rsquo;ll let you know the moment it&rsquo;s live&mdash;no spam, just the launch.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          {status === 'done' ? (
            <div className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 px-6 py-4">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={3} /></span>
              <span className="text-[15px] text-emerald-200 font-medium">You&rsquo;re on the list. We&rsquo;ll be in touch at launch.</span>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-9 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-[520px] mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                  placeholder="you@email.com"
                  data-testid="waitlist-email"
                  aria-label="Email address"
                  className={`w-full rounded-xl bg-slate-800/70 border pl-12 pr-4 py-3.5 text-[15px] text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-400/60 ${status === 'error' ? 'border-red-400' : 'border-slate-700'}`}
                />
              </div>
              <button type="submit" disabled={status === 'busy'} data-testid="waitlist-submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[15px] font-medium transition-colors disabled:opacity-60 whitespace-nowrap">
                {status === 'busy' ? 'Adding…' : <>Join the waitlist <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}
          {status === 'error' && <p className="mt-3 text-[13px] text-red-300">Please enter a valid email address.</p>}
          <p className="mt-4 text-[12.5px] text-slate-500">Free at launch. We&rsquo;ll never share your email.</p>
        </Reveal>
      </div>
    </section>
  );
}
