document.addEventListener('DOMContentLoaded', () => {
  initStreakGrid();
  initDemoQuestion();
});

// ============================================================================
// 1. Streak Grid Generator
// ============================================================================
function initStreakGrid() {
  const grid = document.getElementById('streakGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const total = 18 * 7;
  const pattern = [];
  for (let i = 0; i < total; i++) {
    const r = Math.random();
    if (i > total - 14) pattern.push('hot');
    else if (r > 0.82) pattern.push('off');
    else pattern.push('on');
  }

  pattern.forEach((state, i) => {
    const d = document.createElement('div');
    d.className = 'cell' + (state === 'on' ? ' on' : state === 'hot' ? ' hot' : '');
    d.style.animationDelay = (i * 4) + 'ms';
    grid.appendChild(d);
  });
}

// ============================================================================
// 2. Demo Question Interaction
// ============================================================================
function initDemoQuestion() {
  const choices = document.querySelectorAll('#choices .choice');
  const reveal = document.getElementById('reveal');

  choices.forEach(btn => {
    btn.addEventListener('click', () => {
      choices.forEach(b => {
        b.disabled = true;
        if (b.dataset.correct === 'true') b.classList.add('correct');
      });

      if (btn.dataset.correct !== 'true') {
        btn.classList.add('wrong');
      }

      if (reveal) reveal.classList.add('show');
    });
  });
}
