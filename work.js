const grid = document.getElementById('workGrid');
const emptyMsg = document.getElementById('workEmpty');
const countEl = document.getElementById('workCount');
const chips = document.querySelectorAll('.filter-chip');
const cards = grid.querySelectorAll('.work-card');
const categoryLabels = {
plumbers: 'Plumbers',
electricians: 'Electricians',
gardeners: 'Gardeners',
barbers: 'Barbers',
music: 'Music & Lessons',
developers: 'Developers'
};
function applyFilter(filter) {
let visible = 0;
cards.forEach(card => {
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
const valid = ['plumbers', 'electricians', 'gardeners', 'barbers', 'music', 'developers'];
return valid.includes(hash) ? hash : 'all';
}
chips.forEach(chip => {
chip.addEventListener('click', () => {
const filter = chip.dataset.filter;
applyFilter(filter);
history.replaceState(null, '', filter === 'all' ? '#all' : `#${filter}`);
});
});
window.addEventListener('hashchange', () => applyFilter(filterFromHash()));
applyFilter(filterFromHash());