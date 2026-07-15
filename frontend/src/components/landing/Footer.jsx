import React from 'react';
import { Infinity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Infinity className="w-4 h-4 text-blue-600" strokeWidth={2.4} />
          <span className="text-[13.5px] font-semibold text-zinc-900">InfinitySheets</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#resources" className="text-[13.5px] text-zinc-600 hover:text-zinc-900 transition-colors">Free resources</a>
          <a href="#signup" className="text-[13.5px] text-zinc-600 hover:text-zinc-900 transition-colors">Start free</a>
        </div>
      </div>
      <div className="border-t border-zinc-100">
        <p className="max-w-[1280px] mx-auto px-6 pt-5 text-[13px] text-zinc-600 text-center">
          Made with &#10084;&#65039; by Aayan S. Kumar, Angelo Jolwin, and Arihaan Srivastava.
        </p>
        <p className="max-w-[1280px] mx-auto px-6 pt-2 text-[12px] text-zinc-500 text-center">
          &copy; {new Date().getFullYear()} InfinitySheets. All rights reserved.
        </p>
        <p className="max-w-[1280px] mx-auto px-6 py-5 text-[11.5px] leading-relaxed text-zinc-400">
          None of the organizations, examination boards, course providers, or qualifications referenced on this
          website were involved in the creation of, and do not endorse, the resources developed by InfinitySheets.
          All trademarks and course names remain the property of their respective owners and are used solely for
          identification and compatibility purposes.
        </p>
      </div>
    </footer>
  );
}
