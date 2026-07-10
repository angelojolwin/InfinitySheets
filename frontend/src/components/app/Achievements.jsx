import React from 'react';
import { useApp } from '../../context/AppContext';
import { ACHIEVEMENTS } from '../../data/achievements';
import { Share2 } from 'lucide-react';
import { shareProgressCard } from '../../utils/shareCard';
import { toast } from 'sonner';

export default function Achievements() {
  const { state } = useApp();
  const unlocked = new Set(state.achievements || []);
  const ws = state.worksheets || [];

  const share = async () => {
    const total = ws.reduce((n, w) => n + (w.total || 0), 0);
    const correct = ws.reduce((n, w) => n + (w.correct || 0), 0);
    const res = await shareProgressCard({
      name: state.user?.name,
      examTrack: state.user?.examTrack,
      streak: state.streak || 0,
      questions: total,
      sheets: ws.length,
      readiness: total ? Math.round((correct / total) * 100) : 0,
    });
    if (res === 'downloaded') toast.success('Progress card saved — post it anywhere');
    if (res === 'shared') toast.success('Progress card shared');
  };

  return (
    <div className="max-w-[900px]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-[14px] text-zinc-500">
          {unlocked.size} of {ACHIEVEMENTS.length} unlocked. Keep practicing to collect them all.
        </p>
        <button onClick={share} data-testid="share-progress" className="btn-violet inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13.5px] font-medium">
          <Share2 className="w-4 h-4" /> Share progress card
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-5 transition-all ${got ? 'border-blue-200 bg-blue-50/60' : 'border-zinc-200 bg-white opacity-60 grayscale'}`}
              data-testid={`achievement-${a.id}`}
            >
              <div className="text-[32px] leading-none">{a.emoji}</div>
              <div className="text-[15px] font-semibold text-zinc-900 mt-3">{a.title}</div>
              <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">{a.desc}</p>
              <div className={`text-[11px] font-semibold tracking-wider uppercase mt-3 ${got ? 'text-blue-600' : 'text-zinc-400'}`}>
                {got ? 'Unlocked' : 'Locked'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
