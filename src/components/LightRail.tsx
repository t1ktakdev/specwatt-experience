/** Architectural LED profile, not a rendering of registered SpecWATT hardware. */
export function LightRail() {
  return (
    <svg
      viewBox="0 0 347 132"
      role="img"
      aria-label="Архитектурная LED-линия: световой профиль CH2"
    >
      <defs>
        <linearGradient id="rail-wall" x2="0" y2="1">
          <stop stopColor="#35332e" />
          <stop offset="1" stopColor="#202424" />
        </linearGradient>
        <linearGradient id="rail-wash" x2="0" y2="1">
          <stop stopColor="#edb17c" stopOpacity=".28" />
          <stop offset="1" stopColor="#edb17c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 0H347V132H0Z" fill="url(#rail-wall)" />
      <path d="M0 83 347 33V38L0 89Z" fill="#141819" />
      <path d="M0 90 347 39V132H0Z" fill="url(#rail-wash)" />
      <path d="M0 88 347 37" stroke="#d19560" strokeWidth="6" />
      <path d="M0 87 347 36" stroke="#ffe3bb" strokeWidth="2" />
      <path d="M0 101 347 50" stroke="#e0a56c" strokeOpacity=".12" />
    </svg>
  );
}
