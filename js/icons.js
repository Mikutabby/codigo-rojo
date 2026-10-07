/* ════════════════════════════════════════════════════════
   CÓDIGO ROJO — iconos SVG (sin fuentes emoji)
   Todos: stroke currentColor, viewBox 24, tamaño por CSS.
   ════════════════════════════════════════════════════════ */
const ICON = (() => {
  const svg = (inner, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;

  return {
    /* módulos */
    acertijo: svg(`
      <path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/>
      <line x1="9" y1="11" x2="16" y2="11"/><line x1="9" y1="14.5" x2="16" y2="14.5"/>
      <line x1="9" y1="18" x2="13" y2="18"/>`),
    logica: svg(`
      <circle cx="6" cy="7" r="2.4"/><circle cx="18" cy="7" r="2.4"/>
      <circle cx="12" cy="17.5" r="2.4"/>
      <line x1="8.2" y1="8.4" x2="10.4" y2="15.7"/>
      <line x1="15.8" y1="8.4" x2="13.6" y2="15.7"/>
      <line x1="8.4" y1="7" x2="15.6" y2="7"/>`),
    cables: svg(`
      <rect x="2" y="9" width="4" height="6" rx="1"/>
      <rect x="18" y="9" width="4" height="6" rx="1"/>
      <path d="M6 12c3 0 3-4 6-4s3 4 6 4"/>`),
    boton: svg(`
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none"/>`),
    keypad: svg(`
      <rect x="4" y="4" width="7" height="7" rx="1.5"/>
      <rect x="13" y="4" width="7" height="7" rx="1.5"/>
      <rect x="4" y="13" width="7" height="7" rx="1.5"/>
      <rect x="13" y="13" width="7" height="7" rx="1.5"/>`),
    simon: svg(`
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>`),
    password: svg(`
      <circle cx="8" cy="9" r="4"/><path d="M11 11.5L19.5 20"/>
      <path d="M16 17l2-2"/><path d="M18.5 19.5l1.5-1.5"/>`),
    codigo: svg(`
      <rect x="5" y="3" width="14" height="18" rx="2"/>
      <line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/>
      <circle cx="9" cy="12.5" r="1.1" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12.5" r="1.1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="12.5" r="1.1" fill="currentColor" stroke="none"/>
      <circle cx="9" cy="17" r="1.1" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="17" r="1.1" fill="currentColor" stroke="none"/>`),

    /* interfaz */
    home: svg(`
      <path d="M4 11l8-7 8 7"/><path d="M6.5 9.5V20h11V9.5"/>`),
    book: svg(`
      <path d="M12 6.5C10.5 5 8 4.5 4 5v13c4-.5 6.5 0 8 1.5 1.5-1.5 4-2 8-1.5V5c-4-.5-6.5 0-8 1.5z"/>
      <line x1="12" y1="6.5" x2="12" y2="19.5"/>`),
    sound: svg(`
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" fill="currentColor" stroke="none"/>
      <path d="M15 9.5a4 4 0 010 5"/><path d="M17.5 7.5a7.5 7.5 0 010 9"/>`),
    mute: svg(`
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" fill="currentColor" stroke="none"/>
      <line x1="15.5" y1="9.5" x2="20.5" y2="14.5"/>
      <line x1="20.5" y1="9.5" x2="15.5" y2="14.5"/>`),
    retry: svg(`
      <path d="M20 12a8 8 0 11-2.5-5.8"/>
      <polyline points="20 4 20 8 16 8"/>`),
    battery: svg(`
      <rect x="2.5" y="8" width="16" height="8" rx="1.5"/>
      <rect x="19.5" y="10.5" width="2" height="3" rx="0.6" fill="currentColor" stroke="none"/>
      <rect x="4.5" y="10" width="3.5" height="4" rx="0.5" fill="currentColor" stroke="none"/>
      <rect x="9" y="10" width="3.5" height="4" rx="0.5" fill="currentColor" stroke="none"/>`),
    trophy: svg(`
      <path d="M8 4h8v5a4 4 0 01-8 0z"/>
      <path d="M8 5H5.5a2.5 2.5 0 002.5 3"/>
      <path d="M16 5h2.5a2.5 2.5 0 01-2.5 3"/>
      <line x1="12" y1="13" x2="12" y2="16"/>
      <path d="M9 20h6"/><path d="M10 16.5h4V20h-4z"/>`),
    flag: svg(`
      <line x1="6" y1="3" x2="6" y2="21"/>
      <path d="M6 4.5h11l-2.5 3.5L17 11.5H6z" fill="currentColor" stroke="none"/>`),
  };
})();
