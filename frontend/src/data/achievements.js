// Achievement definitions + evaluator. Pure functions over app state so
// they can run after every recorded worksheet.

export const ACHIEVEMENTS = [
  { id: 'first-sheet', emoji: '📝', title: 'First worksheet', desc: 'Complete your very first worksheet.' },
  { id: 'five-sheets', emoji: '📚', title: 'Warming up', desc: 'Complete 5 worksheets.' },
  { id: 'twenty-sheets', emoji: '🏗️', title: 'Building the habit', desc: 'Complete 20 worksheets.' },
  { id: 'fifty-sheets', emoji: '🏛️', title: 'Half a century', desc: 'Complete 50 worksheets.' },
  { id: 'century-questions', emoji: '💯', title: 'Century', desc: 'Answer 100 questions in total.' },
  { id: 'streak-3', emoji: '🔥', title: 'On a roll', desc: 'Reach a 3-day study streak.' },
  { id: 'streak-7', emoji: '🚀', title: 'Full week', desc: 'Reach a 7-day study streak.' },
  { id: 'streak-30', emoji: '🌙', title: 'Unstoppable', desc: 'Reach a 30-day study streak.' },
  { id: 'score-80', emoji: '🎯', title: 'Sharp shooter', desc: 'Score 80% or higher on a worksheet.' },
  { id: 'perfect', emoji: '⭐', title: 'Perfect score', desc: 'Get every question right on a worksheet.' },
  { id: 'comeback', emoji: '💪', title: 'Comeback kid', desc: 'Return to practice after 5+ days away.' },
  { id: 'grade-jump', emoji: '📈', title: 'Level up', desc: 'Improve a subject’s average by 20% or more.' },
  { id: 'night-owl', emoji: '🦉', title: 'Night owl', desc: 'Finish a worksheet between 10pm and 4am.' },
  { id: 'early-bird', emoji: '🐦', title: 'Early bird', desc: 'Finish a worksheet between 5am and 8am.' },
  { id: 'explorer', emoji: '🧭', title: 'Explorer', desc: 'Practice 3 different subjects.' },
];

// Returns the full set of earned achievement ids for a state snapshot.
// `justRecorded` is the sheet that was just submitted (for time-based ones).
export function evaluateAchievements(state, justRecorded) {
  const ws = state.worksheets || [];
  const earned = new Set(state.achievements || []);
  const totalQuestions = ws.reduce((n, w) => n + (w.total || 0), 0);
  const hour = justRecorded ? new Date(justRecorded.date).getHours() : null;

  const add = (id, cond) => { if (cond) earned.add(id); };

  add('first-sheet', ws.length >= 1);
  add('five-sheets', ws.length >= 5);
  add('twenty-sheets', ws.length >= 20);
  add('fifty-sheets', ws.length >= 50);
  add('century-questions', totalQuestions >= 100);
  add('streak-3', (state.streak || 0) >= 3);
  add('streak-7', (state.streak || 0) >= 7);
  add('streak-30', (state.streak || 0) >= 30);
  add('score-80', ws.some((w) => (w.score || 0) >= 80));
  add('perfect', ws.some((w) => w.total > 0 && w.correct === w.total));
  add('explorer', new Set(ws.map((w) => w.subject)).size >= 3);
  if (hour !== null) {
    add('night-owl', hour >= 22 || hour < 4);
    add('early-bird', hour >= 5 && hour < 8);
  }
  // Comeback: gap of 5+ days between the two most recent sheets.
  if (ws.length >= 2) {
    const gapMs = new Date(ws[0].date) - new Date(ws[1].date);
    add('comeback', gapMs >= 5 * 24 * 3600 * 1000);
  }
  // Grade jump: any subject whose recent-half average beats its early-half
  // average by 20+ points (needs at least 4 sheets in the subject).
  const bySubject = {};
  ws.slice().reverse().forEach((w) => { (bySubject[w.subject] = bySubject[w.subject] || []).push(w.score || 0); });
  Object.values(bySubject).forEach((scores) => {
    if (scores.length < 4) return;
    const half = Math.floor(scores.length / 2);
    const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    if (avg(scores.slice(half)) - avg(scores.slice(0, half)) >= 20) earned.add('grade-jump');
  });

  return [...earned];
}
