/**
 * game.js — Detail page logic for GameVault
 * Reads ?id= param → looks up GAMES config → fetches dataSource.json
 * → renders chapter accordion + screenshot grid + lightbox.
 */

'use strict';

/* ── Lightbox State ──────────────────────────────────────── */
const lb = {
  el: null,
  img: null,
  counter: null,
  download: null,
  prev: null,
  next: null,
  close: null,
  images: [],   // flat array of { src, thumbSrc, alt }
  current: 0,
};

/* ── Status Meta ─────────────────────────────────────────── */
const STATUS_META = {
  playing: { label: '● Playing', cls: 'status-playing' },
  completed: { label: '✓ Completed', cls: 'status-completed' },
  wishlist: { label: '♡ Wishlist', cls: 'status-wishlist' },
  paused: { label: '⏸ Paused', cls: 'status-paused' },
};

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initLightbox();

  const id = new URLSearchParams(location.search).get('id');
  const game = (typeof GAMES !== 'undefined') && GAMES.find(g => g.id === id);

  if (!game) {
    renderError('Game not found. <a href="index.html">← Back to library</a>');
    return;
  }

  // Populate static metadata immediately
  renderGameMeta(game);

  // Load screenshot data (if available)
  const container = document.getElementById('chapters-container');
  if (!game.dataSourceUrl) {
    container.innerHTML = `
      <div class="detail-card">
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
          <div style="font-size:2.8rem;margin-bottom:14px">📷</div>
          <p style="font-size:0.95rem">No screenshots added yet — check back soon!</p>
        </div>
      </div>`;
    return;
  }

  try {
    const response = await fetch(game.dataSourceUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    renderChapters(json, game, container);
  } catch (err) {
    container.innerHTML = `
      <div class="error-state">
        ⚠️ Could not load screenshots — check your internet connection.<br/>
        <small style="opacity:.6">${err.message}</small>
      </div>`;
  }
});

/* ── Render Game Metadata ────────────────────────────────── */
function renderGameMeta(game) {
  document.title = `GameVault · ${game.title}`;

  // Resolve hero and cover with fallback priority:
  // if fallbackImage: fallbackBanner → Steam hero | fallbackCover → Steam cover
  const heroSrc  = (game.fallbackImage && game.fallbackBanner) ? game.fallbackBanner : game.bannerArt;
  const coverSrc = (game.fallbackImage && game.fallbackCover)  ? game.fallbackCover  : game.coverArt;

  // Hero background
  const heroImg = document.getElementById('detail-hero-img');
  if (heroImg) {
    heroImg.src = heroSrc;
    heroImg.alt = `${game.title} banner`;
  }

  // Portrait cover thumbnail
  const cover = document.getElementById('detail-cover');
  if (cover) {
    cover.src = coverSrc;
    cover.alt = `${game.title} cover`;
  }

  // Title + subtitle + description
  document.getElementById('detail-title').textContent = game.title;
  document.getElementById('detail-subtitle').textContent = game.subtitle;
  document.getElementById('detail-description').textContent = game.description;

  // Badges — two rows: status+platform+rating, then tags
  const statusMeta = STATUS_META[game.status] || STATUS_META.wishlist;
  const badgesEl = document.getElementById('detail-badges');
  badgesEl.innerHTML = `
    <div class="detail-badges-row">
      <span class="card-status-badge ${statusMeta.cls}" style="position:static">${statusMeta.label}</span>
      <span class="card-platform-badge" style="position:static">${game.platform}</span>
      ${game.rating > 0 ? `<span class="detail-rating"><span class="card-rating-star">★</span>${game.rating}<span class="card-rating-total">/10</span></span>` : ''}
    </div>
    <div class="detail-tags-row">
      <span class="card-tag">${game.genre}</span>
      ${game.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
    </div>
  `;

  // Progress bar
  const fill = document.getElementById('detail-progress-fill');
  const value = document.getElementById('detail-progress-value');
  if (fill && value) {
    const progressGradient = `linear-gradient(90deg, ${game.accentColor}, ${lighten(game.accentColor, 40)})`;
    fill.style.background = progressGradient;
    value.textContent = `${game.progress}%`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { fill.style.width = game.progress + '%'; });
    });
  }

  // Apply accent CSS vars
  document.documentElement.style.setProperty('--game-accent', game.accentColor);
  document.documentElement.style.setProperty('--game-glow', game.accentGlow);

  // Tint orb to game accent colour
  const orb2 = document.querySelector('.bg-orb-2');
  if (orb2) orb2.style.background = `radial-gradient(circle, ${game.accentColor} 0%, transparent 70%)`;
}

/* ── Render Chapters ─────────────────────────────────────── */
function renderChapters(json, game, container) {
  // Build flat image list for lightbox navigation
  lb.images = [];

  const { data } = json;

  // data is: { "Chapter Name": { "1": [filenames], "2": [filenames], ... } }
  const chapterNames = Object.keys(data);

  if (chapterNames.length === 0) {
    container.innerHTML = `<div class="error-state">No chapters found in this game's data.</div>`;
    return;
  }

  container.innerHTML = `
    <h2 class="chapters-title" style="margin-bottom:16px;">
      📸 Screenshots
    </h2>
  `;

  chapterNames.forEach((chapterName, ci) => {
    const subSections = data[chapterName];
    const subKeys = Object.keys(subSections);

    // Gather all images in this chapter for lb
    const chapterImages = [];
    subKeys.forEach(subKey => {
      const files = subSections[subKey];
      files.forEach(file => {
        const folder = chapterName.replace(/ /g, '%20');
        const src = `${game.imageBaseUrl}${folder}/${subKey}/${encodeURIComponent(file)}`;
        // Thumbnail via wsrv.nl: resize to 640px wide at 65% quality (~50–150 KB vs 20 MB)
        const thumbSrc = `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=640&q=65&output=webp`;
        chapterImages.push({ src, thumbSrc, alt: `${chapterName} — ${file}` });
      });
    });

    const globalOffset = lb.images.length;
    lb.images.push(...chapterImages);

    // Count
    const total = chapterImages.length;

    const item = document.createElement('div');
    item.className = 'chapter-item detail-card';
    item.style.padding = '0';
    item.style.marginBottom = '12px';

    item.innerHTML = `
      <div class="chapter-header" role="button" tabindex="0"
           aria-expanded="false" aria-controls="chapter-body-${ci}"
           id="chapter-header-${ci}">
        <span class="chapter-name">${chapterName}</span>
        <span class="chapter-count">${total} shot${total !== 1 ? 's' : ''}</span>
        <span class="chapter-chevron" aria-hidden="true">▼</span>
      </div>
      <div class="chapter-body" id="chapter-body-${ci}" role="region" aria-labelledby="chapter-header-${ci}">
        <div class="screenshot-grid" id="ss-grid-${ci}">
          ${chapterImages.map((img, i) => `
            <div class="screenshot-thumb loading"
                 role="button" tabindex="0"
                 aria-label="Open screenshot ${i + 1} of ${total}"
                 data-global-index="${globalOffset + i}">
              <img
                src="${img.thumbSrc}"
                alt="${img.alt}"
                loading="lazy"
                width="320" height="180"
                onload="this.closest('.screenshot-thumb').classList.remove('loading')"
                onerror="this.closest('.screenshot-thumb').style.opacity='0.3'"
              />
              <div class="screenshot-thumb-overlay" aria-hidden="true"></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Toggle
    const header = item.querySelector('.chapter-header');
    const body = item.querySelector('.chapter-body');

    const toggle = () => {
      const isOpen = item.classList.toggle('open');
      header.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) body.style.display = 'block';
      else body.style.display = 'none';
    };

    // Open first chapter by default
    if (ci === 0) toggle();

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

    // Screenshot click → lightbox
    item.querySelectorAll('.screenshot-thumb').forEach(thumb => {
      const open = () => openLightbox(parseInt(thumb.dataset.globalIndex, 10));
      thumb.addEventListener('click', open);
      thumb.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
    });

    container.appendChild(item);
  });
}

/* ── Lightbox ────────────────────────────────────────────── */
function initLightbox() {
  lb.el = document.getElementById('lightbox');
  lb.img = document.getElementById('lightbox-img');
  lb.counter = document.getElementById('lightbox-counter');
  lb.download = document.getElementById('lightbox-download');
  lb.prev = document.getElementById('lightbox-prev');
  lb.next = document.getElementById('lightbox-next');
  lb.close = document.getElementById('lightbox-close');

  lb.close.addEventListener('click', closeLightbox);
  lb.prev.addEventListener('click', () => navigate(-1));
  lb.next.addEventListener('click', () => navigate(1));

  lb.el.addEventListener('click', e => { if (e.target === lb.el) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.el.classList.contains('visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch swipe
  let touchStartX = 0;
  lb.el.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  });
}

function openLightbox(index) {
  lb.current = index;
  updateLightboxImage();
  lb.el.classList.add('visible');
  document.body.style.overflow = 'hidden';
  lb.close.focus();
}

function closeLightbox() {
  lb.el.classList.remove('visible');
  document.body.style.overflow = '';
}

function navigate(dir) {
  lb.current = (lb.current + dir + lb.images.length) % lb.images.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const item = lb.images[lb.current];
  lb.img.style.opacity = '0';
  // Lightbox always shows the full-res original for best quality
  lb.img.src = item.src;
  lb.img.alt = item.alt;
  lb.img.onload = () => { lb.img.style.opacity = '1'; };
  lb.counter.textContent = `${lb.current + 1} / ${lb.images.length}`;

  // Download link always points to the full-res original
  if (lb.download) {
    lb.download.href = item.src;
    lb.download.download = item.alt.split('/').pop() || `screenshot-${lb.current + 1}.jpg`;
  }

  lb.prev.style.visibility = lb.images.length > 1 ? 'visible' : 'hidden';
  lb.next.style.visibility = lb.images.length > 1 ? 'visible' : 'hidden';
}

/* ── Utility ─────────────────────────────────────────────── */
function renderError(html) {
  document.getElementById('main-content').innerHTML =
    `<div class="container" style="padding:80px 24px;text-align:center;color:var(--text-muted);line-height:2">
       <div style="font-size:2.5rem;margin-bottom:16px">⚠️</div>
       ${html}
     </div>`;
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function lighten(hex, amount) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}
