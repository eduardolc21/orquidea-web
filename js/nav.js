// Menú móvil y año del pie. Sin dependencias: se carga también en /legal/.
const toggle = document.querySelector('[data-orq-nav-toggle]'), nav = document.querySelector('[data-orq-nav]');
if (toggle && nav) {
  const set = (open) => { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => set(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); toggle.focus(); } });
}
document.querySelectorAll('[data-orq-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
