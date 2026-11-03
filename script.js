/* ── THEME TOGGLE ── */
const themeBtn = document.getElementById('themeBtn');

// 1. Check if user has manually chosen a theme before (localStorage)
// 2. If not, fall back to their OS/browser default preference
const savedTheme = localStorage.getItem('portfolio-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;

// Apply on load (before any rendering)
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  // Save the user's manual choice so it persists on next visit
  localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
});

// Also watch for OS theme changes in real-time (e.g. user switches system dark/light mode)
// Only applies if the user hasn't manually overridden it
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('portfolio-theme')) {
    isDark = e.matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  }
});

/* ── MOBILE NAV ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobNav');

ham.addEventListener('click', e => {
  e.stopPropagation();
  mob.classList.toggle('open');
});

function closeMob() { mob.classList.remove('open'); }

document.addEventListener('click', e => {
  if (!mob.contains(e.target) && !ham.contains(e.target)) {
    mob.classList.remove('open');
  }
});

/* ── TYPEWRITER ── */
const roles = [
  'B-Tech CSE Student',
  'C++ Programmer',
  'Frontend Developer',
  'Python Coder',
  'Web Developer',
  'Problem Solver'
];
let ri = 0, ci = 0, dl = false;
const tel = document.getElementById('typedRole');

(function type() {
  const cur = roles[ri];
  if (!dl) {
    tel.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { setTimeout(() => dl = true, 1800); setTimeout(type, 100); return; }
  } else {
    tel.textContent = cur.slice(0, --ci);
    if (ci === 0) { dl = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, dl ? 55 : 100);
})();

/* ── COUNT UP ── */
function countUp(el, target) {
  let n = 0;
  const step = target / 90;
  (function f() {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n) + '+';
    if (n < target) requestAnimationFrame(f);
  })();
}

let counted = false;
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    countUp(document.getElementById('sc2'), document.querySelectorAll('#skills .skc:first-child .sktag').length);
    countUp(document.getElementById('sc3'), new Date().getFullYear() - 2023);
  }
}, { threshold: 0.3 }).observe(document.getElementById('hero'));

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('in'), i * 65);
  });
}, { threshold: 0.07 });

document.querySelectorAll('.rev').forEach(r => ro.observe(r));

/* ── SKILL BARS ── */
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.sbfill').forEach(b => b.style.width = b.dataset.w + '%');
  }
}, { threshold: 0.15 }).observe(document.getElementById('skills'));

/* ── SCROLL TOP ── */
const stbEl = document.getElementById('stb');
window.addEventListener('scroll', () => stbEl.classList.toggle('vis', scrollY > 500));

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 3200);
}

/* ── AVATAR UPLOAD ── */
function trigUp() {
  document.getElementById('avFile').click();
}

function handleUp(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const imageData = ev.target.result;
    displayAvatar(imageData);
    try {
      localStorage.setItem('portfolio-avatar', imageData);
      showToast('Photo saved in this browser. 📸');
    } catch (error) {
      showToast('Photo updated for this visit; browser storage is full.');
    }
  };
  reader.readAsDataURL(file);
}

function displayAvatar(imageData) {
  const box = document.getElementById('avBox');
  box.innerHTML = `
    <img alt="Profile Photo" class="av-img-dark"/>
    <img alt="Profile Photo" class="av-img-light"/>
    <button class="av-edit" onclick="trigUp()" aria-label="Change profile photo"><i class="fas fa-pen"></i></button>
    <input type="file" id="avFile" class="av-file" accept="image/*" onchange="handleUp(event)"/>
  `;
  box.querySelectorAll('img').forEach(img => { img.src = imageData; });
}

try {
  const savedAvatar = localStorage.getItem('portfolio-avatar');
  if (savedAvatar) displayAvatar(savedAvatar);
} catch (error) {
  // Keep the bundled profile image when browser storage is unavailable.
}

/* ── GITHUB AUTO-LOAD (arnab8123) ── */
const GH_USER = 'arnab8123';
const FEATURED_REPOS = ['judo', 'rmcti', 'f1-web-project'];
const PROJECT_URLS = {
  judo: 'https://judomeet.online',
  rmcti: 'https://rmcti.in',
  'f1-web-project': 'https://arnab8123.github.io/F1-web-project'
};
const PROJECT_DESCRIPTIONS = {
  judo: 'A simple platform for hosting and joining online meetings.',
  rmcti: 'A computer training institute website featuring courses, admissions, faculty, certifications, and contact information.',
  'f1-web-project': 'An unofficial Formula 1 fan site with news, schedules, results, drivers, teams, and videos.'
};

async function loadGH() {
  const g = document.getElementById('pgrid');
  g.replaceChildren();

  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100&type=public`);
    if (!res.ok) throw new Error('not found');
    const allRepos = await res.json();
    const reposByName = new Map(allRepos.map(repo => [repo.name.toLowerCase(), repo]));
    const repos = FEATURED_REPOS.map(name => reposByName.get(name)).filter(Boolean);

    if (!repos.length) {
      g.innerHTML = `<div class="pempty"><p>// featured repositories are unavailable.</p></div>`;
      document.getElementById('sc1').textContent = '0';
      return;
    }

    const em = {
      JavaScript: '🟨', HTML: '🌐', CSS: '🎨',
      Python: '🐍', Java: '☕', 'C++': '⚙️',
      C: '🔵', PHP: '🐘', default: '📦'
    };

    g.innerHTML = repos.map(r => `
      <div class="pc rev">
        <div class="pctop">
          <span class="pcicon">${em[r.language] || em.default}</span>
          <div class="pclnks">
            <a href="${PROJECT_URLS[r.name.toLowerCase()]}" target="_blank" rel="noopener noreferrer" class="pclb" title="Open project" aria-label="Open ${r.name} project"><i class="fas fa-arrow-up-right-from-square"></i></a>
            <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="pclb" title="GitHub"><i class="fab fa-github"></i></a>
          </div>
        </div>
        <div class="pcname">${r.name}</div>
        <div class="pcdesc">${PROJECT_DESCRIPTIONS[r.name.toLowerCase()] || r.description || 'No description provided.'}</div>
        <div class="pctags"><span class="pctag">${r.language || 'N/A'}</span></div>
        <div class="pcmeta">
          <span><i class="fas fa-star"></i> ${r.stargazers_count}</span>
          <span><i class="fas fa-code-branch"></i> ${r.forks_count}</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.pc').forEach(c => ro.observe(c));
    countUp(document.getElementById('sc1'), repos.length);

  } catch (err) {
    g.innerHTML = `<div class="pempty"><p>// could not load featured repositories.</p></div>`;
    document.getElementById('sc1').textContent = '—';
  }
}

/* Auto-load on page ready */
document.addEventListener('DOMContentLoaded', () => {
  loadGH();
});
