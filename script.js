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
  'Diploma CS Student',
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
    countUp(document.getElementById('sc1'), 5);   // projects
    countUp(document.getElementById('sc2'), 7);   // languages
    countUp(document.getElementById('sc3'), 3);   // years study
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
    const box = document.getElementById('avBox');
    // Replace placeholder with uploaded image for BOTH theme slots
    box.innerHTML = `
      <img src="${ev.target.result}" alt="Profile Photo" class="av-img-dark"/>
      <img src="${ev.target.result}" alt="Profile Photo" class="av-img-light"/>
      <button class="av-edit" onclick="trigUp()"><i class="fas fa-pen"></i></button>
      <input type="file" id="avFile" class="av-file" accept="image/*" onchange="handleUp(event)"/>
    `;
    showToast('Photo uploaded! 📸');
  };
  reader.readAsDataURL(file);
}

/* ── GITHUB AUTO-LOAD (arnab8123) ── */
const GH_USER = 'arnab8123';

async function loadGH() {
  const g = document.getElementById('pgrid');
  g.innerHTML = `<div class="pload"><div class="sp"></div><p>// fetching @${GH_USER} repos...</p></div>`;

  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=9&type=public`);
    if (!res.ok) throw new Error('not found');
    const repos = await res.json();

    if (!repos.length) {
      g.innerHTML = `<div class="pempty"><p>// no public repos found.</p></div>`;
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
            ${r.homepage ? `<a href="${r.homepage}" target="_blank" class="pclb" title="Live"><i class="fas fa-external-link-alt"></i></a>` : ''}
            <a href="${r.html_url}" target="_blank" class="pclb" title="GitHub"><i class="fab fa-github"></i></a>
          </div>
        </div>
        <div class="pcname">${r.name}</div>
        <div class="pcdesc">${r.description || 'No description provided.'}</div>
        <div class="pctags"><span class="pctag">${r.language || 'N/A'}</span></div>
        <div class="pcmeta">
          <span><i class="fas fa-star"></i> ${r.stargazers_count}</span>
          <span><i class="fas fa-code-branch"></i> ${r.forks_count}</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.pc').forEach(c => ro.observe(c));
    showToast(`✅ Loaded ${repos.length} repos from @${GH_USER}`);

  } catch (err) {
    g.innerHTML = `<div class="pempty"><p>// could not reach GitHub API. check connection.</p></div>`;
  }
}

/* Auto-load on page ready */
document.addEventListener('DOMContentLoaded', () => {
  loadGH();
});

/* ── LIVE PREVIEW ── */
const PREVIEW_PROJECTS = [
  { label: 'F1 Fan Page',        icon: '🏎️', url: 'https://arnab8123.github.io/f1-web-page/' },
  { label: 'Attendance System',  icon: '📋', url: 'https://arnab8123.github.io/attendance_system/' },
  { label: 'Portfolio',          icon: '🌐', url: 'https://arnab8123.github.io' },
];

let currentPreviewIndex = 0;
let loadTimer = null;

function initPreview() {
  const tabsContainer = document.getElementById('previewTabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = PREVIEW_PROJECTS.map((p, i) => `
    <button class="ptab ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="switchPreview(${i})">
      <span class="tab-dot"></span>
      <span>${p.icon}</span>
      <span class="tab-label">${p.label}</span>
    </button>
  `).join('');

  loadPreview(0);
}

function switchPreview(index) {
  if (index === currentPreviewIndex) return;
  currentPreviewIndex = index;
  document.querySelectorAll('.ptab').forEach((t, i) => t.classList.toggle('active', i === index));
  loadPreview(index);
}

function loadPreview(index) {
  const project = PREVIEW_PROJECTS[index];
  const frame         = document.getElementById('previewFrame');
  const urlText       = document.getElementById('urlText');
  const extLink       = document.getElementById('openExternal');
  const loaderBar     = document.getElementById('loaderBar');
  const overlayLoad   = document.getElementById('overlayLoading');
  const overlayBlock  = document.getElementById('overlayBlocked');
  const blockedLink   = document.getElementById('blockedLink');
  const statusText    = document.getElementById('statusText');
  if (!frame) return;

  // Update UI
  urlText.textContent  = project.url.replace('https://', '');
  extLink.href         = project.url;
  blockedLink.href     = project.url;
  if (statusText) statusText.textContent = 'Loading ' + project.label + '...';

  if (loadTimer) clearTimeout(loadTimer);

  // Animate fade-out → swap src → fade-in
  frame.classList.add('fading');
  overlayLoad.classList.add('show');
  overlayBlock.classList.remove('show');
  loaderBar.classList.add('loading');

  setTimeout(() => {
    frame.src = project.url;
    frame.classList.remove('fading');
  }, 300);

  frame.onload = () => {
    clearTimeout(loadTimer);
    loaderBar.classList.remove('loading');
    overlayLoad.classList.remove('show');
    if (statusText) statusText.textContent = project.label + ' — loaded';
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      if (!doc || doc.body.innerHTML === '') throw new Error('empty');
    } catch (e) {
      _showBlocked(project);
    }
  };

  // 8-second timeout fallback → show blocked
  loadTimer = setTimeout(() => {
    loaderBar.classList.remove('loading');
    overlayLoad.classList.remove('show');
    _showBlocked(project);
  }, 8000);
}

function _showBlocked(project) {
  const overlayBlock = document.getElementById('overlayBlocked');
  const blockedLink  = document.getElementById('blockedLink');
  const statusText   = document.getElementById('statusText');
  if (overlayBlock) overlayBlock.classList.add('show');
  if (blockedLink)  blockedLink.href = project.url;
  if (statusText)   statusText.textContent = 'Blocked by security policy';
}

function reloadFrame() { loadPreview(currentPreviewIndex); }

/* Hook initPreview into DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => { initPreview(); });