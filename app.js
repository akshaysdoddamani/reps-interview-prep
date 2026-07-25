// Mock Data for the 10-Question Loop Demo
const DEMO_QUESTIONS = [
  {
    text: "Which metric is LEAST informative for selecting an ML model to detect fraud occurring in 0.1% of transactions?",
    options: [
      { text: "Precision-Recall AUC (PR-AUC)", correct: false, explain: "PR-AUC focuses on the minority class, making it highly informative." },
      { text: "Classification Accuracy", correct: true, explain: "Correct! A dummy model predicting Not Fraud gets 99.9% accuracy, making it useless." },
      { text: "F1 Score", correct: false, explain: "F1 score balances precision and recall, which is crucial for imbalanced targets." }
    ]
  },
  {
    text: "To minimize manual review costs while catching as much fraud as possible, which trade-off are you optimizing?",
    options: [
      { text: "Maximizing Recall at a high Precision threshold", correct: true, explain: "Correct! High Precision keeps false alarms low, while maximizing Recall catches actual fraud." },
      { text: "Maximizing Accuracy at a high Recall threshold", correct: false, explain: "Accuracy is misleading here; optimizing accuracy doesn't minimize review costs." },
      { text: "Minimizing Precision to increase ROC-AUC", correct: false, explain: "Minimizing precision increases false alarms, driving up manual review costs." }
    ]
  },
  {
    text: "If you double the decision threshold probability from 0.25 to 0.50 on your fraud model, what is the typical result?",
    options: [
      { text: "Recall increases, Precision decreases", correct: false, explain: "Increasing the threshold makes the model more conservative, which decreases recall." },
      { text: "Precision increases, Recall decreases", correct: true, explain: "Correct! The model becomes more selective, reducing false alarms (higher precision) but missing more fraud (lower recall)." },
      { text: "Both Precision and Recall remain constant", correct: false, explain: "Changing the decision boundary alters predictions, changing both metrics." }
    ]
  }
];

let activeQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initStreakGrid();
  initDemoQuestionLoop();
  initWtpForm();
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
// 2. Interactive Demo Question 10-Step Loop
// ============================================================================
function initDemoQuestionLoop() {
  const btnStart = document.getElementById('btn-start-questions');
  const btnNext = document.getElementById('btn-next-demo-question');

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      document.getElementById('demo-step-1').style.display = 'none';
      document.getElementById('demo-step-2').style.display = 'block';
      renderActiveQuestion();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      activeQuestionIndex++;
      if (activeQuestionIndex < DEMO_QUESTIONS.length) {
        renderActiveQuestion();
      } else {
        // Completion state
        showLoopCompletion();
      }
    });
  }
}

function renderActiveQuestion() {
  const qData = DEMO_QUESTIONS[activeQuestionIndex];
  const counterEl = document.getElementById('q-counter');
  const qTextEl = document.getElementById('active-q-text');
  const choicesContainer = document.getElementById('choices');
  const revealBox = document.getElementById('reveal');
  const nextBtnRow = document.getElementById('next-question-btn-row');

  // Update header texts
  counterEl.innerText = `QUESTION ${activeQuestionIndex + 1} OF 10`;
  qTextEl.innerText = qData.text;

  // Reset elements
  revealBox.classList.remove('show');
  nextBtnRow.style.display = 'none';
  choicesContainer.innerHTML = '';

  // Render options
  qData.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerText = opt.text;
    btn.addEventListener('click', () => {
      // Disable options
      Array.from(choicesContainer.children).forEach(b => {
        b.disabled = true;
        if (b.innerText === qData.options.find(o => o.correct).text) {
          b.classList.add('correct');
        }
      });

      if (!opt.correct) {
        btn.classList.add('wrong');
      }

      // Show explain card
      document.getElementById('explain-text').innerText = opt.explain;
      revealBox.classList.add('show');
      nextBtnRow.style.display = 'block';
    });

    choicesContainer.appendChild(btn);
  });
}

function showLoopCompletion() {
  const container = document.getElementById('demo-loop-container');
  container.innerHTML = `
    <div style="text-align:center;padding:12px 0;" class="animate-fadeIn">
      <span style="font-size:36px;display:block;margin-bottom:12px;">🎉</span>
      <h3 style="font-size:22px;margin-bottom:8px;">10-Question Challenge Completed!</h3>
      <p style="font-size:14.5px;color:var(--ink-soft);max-width:420px;margin:0 auto 20px;line-height:1.6;">
        Outstanding work. You just locked in today's topic and earned <strong style="color:var(--jade);">+1,000 XP</strong> and extended your streak.
      </p>

      <div style="background:var(--paper-dim);padding:14px;border-radius:12px;border:1px solid var(--line);text-align:left;font-size:13.5px;margin-bottom:24px;line-height:1.5;">
        <strong style="color:var(--amber);display:block;margin-bottom:4px;">🔥 Daily Dopamine Story:</strong>
        "How a junior product analyst used consistent daily reps to transition into a Lead ML role at Stripe with a 45% salary increase."
      </div>

      <a href="#research" class="btn btn-primary" style="width:100%;text-align:center;">
        Join the Waitlist & shape the platform →
      </a>
    </div>
  `;
}

// ============================================================================
// 3. Willingness-To-Pay (WTP) Form
// ============================================================================
function initWtpForm() {
  const form = document.getElementById('wtpForm');
  const thanks = document.getElementById('thanks');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      const submission = {
        timestamp: new Date().toLocaleString(),
        status: formData.get('status'),
        habit: formData.get('habit'),
        price: formData.get('price'),
        email: formData.get('email') || 'N/A'
      };

      // Save to LocalStorage privately on client
      const stored = JSON.parse(localStorage.getItem('reps_wtp_submissions') || '[]');
      stored.push(submission);
      localStorage.setItem('reps_wtp_submissions', JSON.stringify(stored));

      form.style.display = 'none';
      if (thanks) thanks.classList.add('show');
    });
  }
}
