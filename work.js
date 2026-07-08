/* ============================================================
   Portfolio data + rendering + filtering
   ------------------------------------------------------------
   TO ADD A REAL CLIENT: add one object to the projects array.
     name     — the business name
     category — one of: plumbers | electricians | gardeners | barbers | music
                (add new categories by also adding a filter chip in work.html
                 and a dropdown link in each page's nav)
     url      — the live site ('' if not yet live)
     img      — path to a screenshot, e.g. 'images/work/bayside-plumbing.jpg'
                (null = an auto-generated placeholder thumbnail is used)
     blurb    — one short sentence about the build
     sample   — true shows a SAMPLE badge; set to false (or remove) for real work.
                Delete the sample entries before launch — a portfolio of real
                work only, however small, earns more trust than padding.
   ============================================================ */

const projects = [
  {
    name: 'Suburban Rhythm Music Studio',
    category: 'music',
    url: 'https://suburbanrhythm.com.au',
    img: null,
    blurb: 'Four-page site for a Melbourne drum teacher — interactive drum kit, lesson info, and easy booking.',
    sample: false
  },
  {
    name: 'Bayside Plumbing Co.',
    category: 'plumbers',
    url: '',
    img: null,
    blurb: 'Sample project — replace with a real client build.',
    sample: true
  },
  {
    name: 'Volt & Wire Electrical',
    category: 'electricians',
    url: '',
    img: null,
    blurb: 'Sample project — replace with a real client build.',
    sample: true
  },
  {
    name: 'Greenline Garden Care',
    category: 'gardeners',
    url: '',
    img: null,
    blurb: 'Sample project — replace with a real client build.',
    sample: true
  },
  {
    name: 'Fade District Barbershop',
    category: 'barbers',
    url: '',
    img: null,
    blurb: 'Sample project — replace with a real client build.',
    sample: true
  }
];

const categoryLabels = {
  plumbers: 'Plumbers',
  electricians: 'Electricians',
  gardeners: 'Gardeners',
  barbers: 'Barbers',
  music: 'Music & Lessons'
};

/* palette rotation for placeholder thumbs */
const thumbColors = ['#219ebc', '#fb8500', '#8ecae6', '#ffb703', '#023047'];

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function thumbSVG(project, index) {
  const color = thumbColors[index % thumbColors.length];
  const label = (categoryLabels[project.category] || '').toUpperCase();
  return `
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder preview for ${project.name}">
    <rect width="400" height="300" fill="#f7fafc"/>
    <rect width="400" height="34" fill="#023047"/>
    <circle cx="18" cy="17" r="5" fill="#fb8500"/>
    <circle cx="36" cy="17" r="5" fill="#ffb703"/>
    <circle cx="54" cy="17" r="5" fill="#8ecae6"/>
    <rect x="90" y="10" width="220" height="14" rx="7" fill="rgba(142,202,230,0.35)"/>
    <rect x="30" y="64" width="340" height="150" rx="10" fill="${color}" opacity="0.16"/>
    <text x="200" y="150" text-anchor="middle" font-family="sans-serif" font-size="52" font-weight="800" fill="${color}">${initials(project.name)}</text>
    <text x="200" y="185" text-anchor="middle" font-family="sans-serif" font-size="13" letter-spacing="3" fill="#023047" opacity="0.65">${label}</text>
    <rect x="30" y="238" width="200" height="12" rx="6" fill="rgba(2,48,71,0.12)"/>
    <rect x="30" y="260" width="140" height="12" rx="6" fill="rgba(2,48,71,0.08)"/>
  </svg>`;
}

const grid = document.getElementById('workGrid');
const emptyMsg = document.getElementById('workEmpty');
const countEl = document.getElementById('workCount');
const chips = document.querySelectorAll('.filter-chip');

function render() {
  grid.innerHTML = projects.map((p, i) => `
    <article class="work-card" data-category="${p.category}">
      ${p.sample ? '<span class="sample-badge">Sample</span>' : ''}
      <div class="work-thumb">
        ${p.img ? `<img src="${p.img}" alt="Screenshot of the ${p.name} website" loading="lazy">` : thumbSVG(p, i)}
      </div>
      <div class="work-body">
        <span class="cat-tag">${categoryLabels[p.category] || p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.blurb}</p>
        ${p.url ? `<a class="work-link" href="${p.url}" target="_blank" rel="noopener">Visit site ↗</a>` : ''}
      </div>
    </article>
  `).join('');
}

function applyFilter(filter) {
  let visible = 0;
  grid.querySelectorAll('.work-card').forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  emptyMsg.style.display = visible === 0 ? 'block' : 'none';
  chips.forEach(chip => {
    chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter));
  });
  const label = filter === 'all' ? 'all trades' : (categoryLabels[filter] || filter);
  countEl.textContent = `Showing ${visible} project${visible === 1 ? '' : 's'} for ${label}.`;
}

function filterFromHash() {
  const hash = location.hash.replace('#', '');
  const valid = ['plumbers', 'electricians', 'gardeners', 'barbers', 'music'];
  return valid.includes(hash) ? hash : 'all';
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    applyFilter(filter);
    history.replaceState(null, '', filter === 'all' ? '#all' : `#${filter}`);
  });
});

/* supports deep links from the navbar dropdown, e.g. work.html#plumbers,
   including hash changes while already on this page */
window.addEventListener('hashchange', () => applyFilter(filterFromHash()));

render();
applyFilter(filterFromHash());
