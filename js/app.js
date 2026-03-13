/**
 * app.js — Hub page logic for GameVault
 * Renders game cards from GAMES config and handles filtering.
 */

'use strict';

/* ── Status helpers ──────────────────────────────────────── */
const STATUS_META = {
  playing: { label: '● Playing', cls: 'status-playing' },
  completed: { label: '✓ Completed', cls: 'status-completed' },
  wishlist: { label: '♡ Wishlist', cls: 'status-wishlist' },
  paused: { label: '⏸ Paused', cls: 'status-paused' },
};

/* ── Stats Counter ───────────────────────────────────────── */
function animateCount(el, to, duration = 800) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(to * ease);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderStats(games) {
  const total = games.length;
  const playing = games.filter(g => g.status === 'playing').length;
  const completed = games.filter(g => g.status === 'completed').length;
  const wishlist = games.filter(g => g.status === 'wishlist').length;

  animateCount(document.getElementById('stat-total'), total);
  animateCount(document.getElementById('stat-playing'), playing);
  animateCount(document.getElementById('stat-completed'), completed);
  animateCount(document.getElementById('stat-wishlist'), wishlist);

  const playingLabel = document.getElementById('playing-label');
  if (playingLabel) playingLabel.textContent = `${playing} Playing`;
}

/* ── Simple color lightening ─────────────────────────────── */
function lighten(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

/* ── Card Builder ────────────────────────────────────────── */
function buildCard(game) {
  const status = STATUS_META[game.status] || STATUS_META.wishlist;
  const hasData = !!game.dataSourceUrl;
  const progressGradient = `linear-gradient(90deg, ${game.accentColor}, ${lighten(game.accentColor, 40)})`;

  const card = document.createElement('article');
  card.className = 'game-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('data-status', game.status);
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Open ${game.title}`);
  card.style.setProperty('--game-accent', game.accentColor);
  card.style.setProperty('--game-glow', game.accentGlow);

  card.innerHTML = `
    <!-- Steam landscape banner strip (library_hero.jpg) -->
    <div class="card-banner">
      <img
        src="${game.bannerArt}"
        alt="${game.title} banner"
        loading="lazy"
        width="800"
        height="300"
        onerror="this.style.opacity='0.3'"
      />
      <div class="card-banner-overlay"></div>
      <span class="card-status-badge ${status.cls}" aria-label="Status: ${game.status}">${status.label}</span>
      <span class="card-platform-badge">${game.platform}</span>
    </div>

    <!-- Portrait cover overlapping banner bottom + title -->
    <div class="card-cover-row">
      <div class="card-cover">
        <img
          src="${game.coverArt}"
          alt="${game.title} cover"
          loading="lazy"
          width="90"
          height="135"
          onerror="this.style.opacity='0.3'"
        />
      </div>
      <div class="card-cover-meta">
        <div class="card-title">${game.title}</div>
        <div class="card-subtitle">${game.subtitle}</div>
      </div>
    </div>

    <!-- Card body -->
    <div class="card-body">
      <p class="card-description">${game.description}</p>

      <div class="card-tags" aria-label="Tags">
        ${game.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
      </div>

      <div class="card-progress-section">
        <div class="card-progress-header">
          <span class="card-progress-label">Progress</span>
          <span class="card-progress-value">${game.progress}%</span>
        </div>
        <div class="progress-bar-track" role="progressbar"
             aria-valuenow="${game.progress}" aria-valuemin="0" aria-valuemax="100">
          <div
            class="progress-bar-fill"
            data-target="${game.progress}"
            style="width:0%; background:${progressGradient}"
          ></div>
        </div>
      </div>

      <div class="card-actions">
        ${hasData
      ? `<a href="game.html?id=${game.id}" class="btn-primary btn-accent"
                aria-label="View ${game.title} screenshots">
               📸 &nbsp;Screenshots
             </a>`
      : `<button class="btn-primary btn-accent disabled" disabled aria-disabled="true">
               📷 &nbsp;No Screenshots Yet
             </button>`
    }
        <button class="btn-ghost" title="Share" aria-label="Share ${game.title}"
                onclick="shareGame('${game.id}')">🔗</button>
      </div>
    </div>
  `;

  // Make the whole card clickable
  const dest = `game.html?id=${game.id}`;
  card.addEventListener('click', (e) => {
    // Don't navigate if user clicked a button/link inside the card
    if (e.target.closest('a, button')) return;
    location.href = dest;
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.href = dest; }
  });

  // Animate progress bar on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fill = card.querySelector('.progress-bar-fill');
      if (fill) fill.style.width = fill.dataset.target + '%';
    });
  });

  return card;
}

/* ── Filter Logic ────────────────────────────────────────── */
let currentFilter = 'all';

function renderGrid(filter) {
  const grid = document.getElementById('games-grid');
  const count = document.getElementById('section-count');
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? GAMES
    : GAMES.filter(g => g.status === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎮</div>
        <p class="empty-state-text">No games in this category yet.</p>
      </div>`;
    count.textContent = '0 games';
    return;
  }

  count.textContent = `${filtered.length} game${filtered.length !== 1 ? 's' : ''}`;
  filtered.forEach(g => grid.appendChild(buildCard(g)));
}

function setupFilters() {
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-tab').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderGrid(currentFilter);
    });
  });
}

/* ── Share ───────────────────────────────────────────────── */
function shareGame(id) {
  const url = `${location.origin}${location.pathname.replace('index.html', '')}game.html?id=${id}`;
  const game = GAMES.find(g => g.id === id);
  if (navigator.share) {
    navigator.share({ title: game?.title || 'GameVault', url }).catch(() => { });
  } else {
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copied!'))
      .catch(() => { });
  }
}

function showToast(msg) {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);
    padding:10px 22px;background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.15);border-radius:100px;color:#fff;
    font-size:0.85rem;font-weight:600;z-index:9999;
    transition:all 0.3s ease;opacity:0;font-family:'Inter',sans-serif;
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => el.remove(), 400);
  }, 2000);
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderStats(GAMES);
  renderGrid('all');
  setupFilters();
});
