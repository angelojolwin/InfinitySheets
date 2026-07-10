// Renders a shareable progress card to a canvas and shares/downloads it.

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

export function drawShareCard({ name, examTrack, streak, questions, sheets, readiness }) {
  const W = 1080, H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');

  // background
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#1e3a8a');
  c.fillStyle = bg;
  c.fillRect(0, 0, W, H);

  // faint infinity squiggle
  c.strokeStyle = 'rgba(147, 197, 253, 0.18)';
  c.lineWidth = 26;
  c.beginPath();
  c.ellipse(360, 900, 150, 90, 0.3, 0, Math.PI * 2);
  c.ellipse(640, 860, 150, 90, -0.3, 0, Math.PI * 2);
  c.stroke();

  // logo row
  c.fillStyle = '#3b82f6';
  roundRect(c, 80, 80, 72, 72, 20);
  c.fill();
  c.fillStyle = '#fff';
  c.font = 'bold 44px system-ui, sans-serif';
  c.fillText('∞', 98, 132);
  c.font = '600 44px system-ui, sans-serif';
  c.fillText('InfinitySheets', 176, 130);

  // headline
  c.fillStyle = '#93c5fd';
  c.font = '600 30px system-ui, sans-serif';
  c.fillText(`${name || 'A student'} · ${examTrack || ''}`.trim(), 84, 250);
  c.fillStyle = '#ffffff';
  c.font = '700 88px system-ui, sans-serif';
  c.fillText(`${streak} day streak 🔥`, 80, 360);

  // stat tiles
  const tiles = [
    { label: 'QUESTIONS ANSWERED', value: String(questions) },
    { label: 'WORKSHEETS DONE', value: String(sheets) },
    { label: 'READINESS', value: `${readiness}%` },
  ];
  tiles.forEach((t, i) => {
    const y = 440 + i * 150;
    c.fillStyle = 'rgba(255,255,255,0.08)';
    roundRect(c, 80, y, 920, 120, 24);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.15)';
    c.lineWidth = 2;
    roundRect(c, 80, y, 920, 120, 24);
    c.stroke();
    c.fillStyle = '#94a3b8';
    c.font = '600 24px system-ui, sans-serif';
    c.fillText(t.label, 116, y + 50);
    c.fillStyle = '#fff';
    c.font = '700 52px system-ui, sans-serif';
    c.fillText(t.value, 116, y + 102);
  });

  // footer
  c.fillStyle = '#93c5fd';
  c.font = '600 32px system-ui, sans-serif';
  c.fillText('Study smarter, free — InfinitySheets', 80, 1010);

  return canvas;
}

export async function shareProgressCard(stats) {
  const canvas = drawShareCard(stats);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
  const file = new File([blob], 'infinitysheets-progress.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'My InfinitySheets progress' });
      return 'shared';
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
    }
  }
  // Fallback: download the image.
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'infinitysheets-progress.png';
  a.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
