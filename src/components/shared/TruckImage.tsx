export function TruckImage({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Truck"
    >
      {/* Trailer body */}
      <rect x="2" y="12" width="72" height="40" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      {/* Trailer door lines */}
      <line x1="38" y1="12" x2="38" y2="52" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="20" y1="12" x2="20" y2="52" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="56" y1="12" x2="56" y2="52" stroke="#94a3b8" strokeWidth="0.8" />
      {/* Trailer top ridge */}
      <rect x="2" y="10" width="72" height="4" rx="1" fill="#cbd5e1" />
      {/* Cab body */}
      <rect x="74" y="20" width="42" height="32" rx="3" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      {/* Cab roof fairing */}
      <path d="M74 20 Q80 10 96 10 L116 10 Q118 10 118 14 L118 20 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      {/* Windshield */}
      <path d="M92 14 Q96 11 108 11 L114 11 Q116 11 116 14 L116 22 L90 22 Z" fill="#93c5fd" opacity="0.7" />
      {/* Cab side window */}
      <rect x="76" y="22" width="14" height="10" rx="1.5" fill="#93c5fd" opacity="0.7" />
      {/* Cab door panel */}
      <rect x="76" y="35" width="14" height="14" rx="1" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
      {/* Door handle */}
      <rect x="86" y="41" width="3" height="1.5" rx="0.75" fill="#94a3b8" />
      {/* Exhaust stack */}
      <rect x="89" y="6" width="3" height="8" rx="1" fill="#94a3b8" />
      <ellipse cx="90.5" cy="6" rx="2" ry="1" fill="#64748b" />
      {/* Front bumper */}
      <rect x="112" y="40" width="6" height="5" rx="1" fill="#94a3b8" />
      {/* Headlight */}
      <rect x="113" y="28" width="4" height="6" rx="1" fill="#fef08a" opacity="0.9" />
      <rect x="113" y="35" width="4" height="3" rx="0.5" fill="#fca5a5" opacity="0.8" />
      {/* Step */}
      <rect x="76" y="50" width="38" height="3" rx="1" fill="#94a3b8" />
      {/* Rear trailer wheels */}
      <circle cx="18" cy="58" r="8" fill="#334155" />
      <circle cx="18" cy="58" r="4.5" fill="#475569" />
      <circle cx="18" cy="58" r="2" fill="#64748b" />
      <circle cx="32" cy="58" r="8" fill="#334155" />
      <circle cx="32" cy="58" r="4.5" fill="#475569" />
      <circle cx="32" cy="58" r="2" fill="#64748b" />
      {/* Front axle wheels */}
      <circle cx="96" cy="58" r="8" fill="#334155" />
      <circle cx="96" cy="58" r="4.5" fill="#475569" />
      <circle cx="96" cy="58" r="2" fill="#64748b" />
      {/* Ground shadow */}
      <ellipse cx="60" cy="70" rx="52" ry="2.5" fill="#0f172a" opacity="0.25" />
    </svg>
  );
}
