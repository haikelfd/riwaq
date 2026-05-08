'use client';

export default function SuccessIllustration() {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 360 300"
        className="w-full max-w-[340px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Enhanced vitrine / display case ── */}
        <g className="success-shelf-enter">
          {/* Glass back panel with gradient */}
          <rect x="45" y="55" width="270" height="140" rx="8" stroke="#D97706" strokeWidth="1.5" fill="#FFFBEB" opacity="0.15" />
          {/* Inner glow edge */}
          <rect x="48" y="58" width="264" height="134" rx="6" stroke="#D97706" strokeWidth="0.5" fill="none" opacity="0.2" />

          {/* Top decorative bar with crown molding */}
          <rect x="42" y="50" width="276" height="10" rx="3" fill="#D97706" opacity="0.12" />
          <line x1="42" y1="60" x2="318" y2="60" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <line x1="45" y1="53" x2="315" y2="53" stroke="#D97706" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />

          {/* Side pillars */}
          <rect x="45" y="60" width="6" height="135" rx="1" fill="#D97706" opacity="0.08" />
          <rect x="309" y="60" width="6" height="135" rx="1" fill="#D97706" opacity="0.08" />
          <line x1="48" y1="60" x2="48" y2="195" stroke="#D97706" strokeWidth="1" opacity="0.25" />
          <line x1="312" y1="60" x2="312" y2="195" stroke="#D97706" strokeWidth="1" opacity="0.25" />

          {/* Shelf surface (thick, prominent) */}
          <rect x="38" y="190" width="284" height="6" rx="2" fill="#D97706" opacity="0.15" />
          <line x1="38" y1="190" x2="322" y2="190" stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="38" y1="196" x2="322" y2="196" stroke="#D97706" strokeWidth="1" strokeLinecap="round" opacity="0.2" />

          {/* Shelf bracket details */}
          <path d="M52 196 L52 183 L68 183" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M308 196 L308 183 L292 183" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          {/* Center bracket */}
          <path d="M175 196 L175 186 L185 186" stroke="#D97706" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3" />

          {/* Subtle spotlight glow on product area */}
          <ellipse cx="180" cy="140" rx="55" ry="40" fill="#D97706" opacity="0.04" />

          {/* Glass reflection lines */}
          <line x1="60" y1="70" x2="60" y2="120" stroke="white" strokeWidth="0.5" opacity="0.15" />
          <line x1="300" y1="80" x2="300" y2="110" stroke="white" strokeWidth="0.5" opacity="0.1" />
        </g>

        {/* ── Product (coffee machine) ── */}
        <g className="success-product-enter">
          {/* Machine body */}
          <rect x="145" y="115" width="70" height="65" rx="5" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Top section */}
          <rect x="150" y="110" width="60" height="12" rx="3" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Gauge circle */}
          <circle cx="180" cy="140" r="12" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="180" cy="140" r="4" fill="#94A3B8" opacity="0.3" />
          {/* Drip tray */}
          <rect x="158" y="168" width="44" height="8" rx="2" stroke="#94A3B8" strokeWidth="1" />
          {/* Steam lines */}
          <path d="M165 105 Q167 97 165 89" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none" className="success-steam" />
          <path d="M180 103 Q182 95 180 87" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none" className="success-steam" style={{ animationDelay: '0.3s' }} />
          <path d="M195 105 Q197 97 195 89" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none" className="success-steam" style={{ animationDelay: '0.6s' }} />
        </g>

        {/* ── Price tag ── */}
        <g className="success-price-enter">
          <path d="M195 115 Q200 125 198 133" stroke="#D97706" strokeWidth="1" fill="none" />
          <path d="M188 133 L208 133 L212 143 L208 153 L188 153 L188 133 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="192" cy="138" r="2" stroke="#D97706" strokeWidth="1" fill="none" />
          <text x="200" y="147" textAnchor="middle" fontSize="8" fill="#D97706" fontFamily="Inter, sans-serif" fontWeight="600">TND</text>
        </g>

        {/* ── Big checkmark badge ── */}
        <g className="success-check-enter">
          <circle cx="180" cy="82" r="16" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="2" />
          <path d="M172 82 L177 87 L188 76" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* ── Sparkles ── */}
        <g className="success-sparkle" style={{ animationDelay: '0.8s' }}>
          <path d="M80 78 L83 73 L86 78 L83 83 Z" fill="#F59E0B" />
        </g>
        <g className="success-sparkle" style={{ animationDelay: '1.2s' }}>
          <path d="M278 72 L281 67 L284 72 L281 77 Z" fill="#14B8A6" />
        </g>
        <g className="success-sparkle" style={{ animationDelay: '0.5s' }}>
          <path d="M115 65 L117 61 L119 65 L117 69 Z" fill="#F59E0B" />
        </g>
        <g className="success-sparkle" style={{ animationDelay: '1.5s' }}>
          <path d="M248 88 L250 84 L252 88 L250 92 Z" fill="#14B8A6" />
        </g>

        {/* ── Crowd of people / visitors ── */}
        {/* Person 1 — left side, short */}
        <g className="success-person" style={{ animationDelay: '1.0s' }}>
          <circle cx="85" cy="210" r="6" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <line x1="85" y1="216" x2="85" y2="237" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="85" y1="223" x2="78" y2="230" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="85" y1="223" x2="92" y2="230" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="85" y1="237" x2="80" y2="250" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="85" y1="237" x2="90" y2="250" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Person 2 — left-center, taller, arm pointing at product */}
        <g className="success-person" style={{ animationDelay: '1.3s' }}>
          <circle cx="130" cy="205" r="6.5" stroke="#64748B" strokeWidth="1.5" fill="none" />
          <line x1="130" y1="212" x2="130" y2="237" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="130" y1="219" x2="120" y2="227" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pointing arm toward shelf */}
          <line x1="130" y1="219" x2="145" y2="211" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="130" y1="237" x2="125" y2="253" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="130" y1="237" x2="135" y2="253" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Person 3 — center, shorter, raised arms (excited) */}
        <g className="success-person" style={{ animationDelay: '1.6s' }}>
          <circle cx="180" cy="213" r="5.5" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <line x1="180" y1="219" x2="180" y2="240" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="180" y1="225" x2="172" y2="217" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="180" y1="225" x2="188" y2="217" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="180" y1="240" x2="175" y2="255" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="180" y1="240" x2="185" y2="255" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Person 4 — right-center, tallish */}
        <g className="success-person" style={{ animationDelay: '1.9s' }}>
          <circle cx="225" cy="207" r="6" stroke="#64748B" strokeWidth="1.5" fill="none" />
          <line x1="225" y1="213" x2="225" y2="239" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="225" y1="221" x2="216" y2="229" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="225" y1="221" x2="234" y2="229" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="225" y1="239" x2="220" y2="255" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="225" y1="239" x2="230" y2="255" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Person 5 — right side, short, phone up (taking photo) */}
        <g className="success-person" style={{ animationDelay: '2.2s' }}>
          <circle cx="275" cy="212" r="5.5" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <line x1="275" y1="218" x2="275" y2="240" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="275" y1="225" x2="268" y2="233" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Arm holding phone up */}
          <line x1="275" y1="225" x2="285" y2="215" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Phone */}
          <rect x="283" y="209" width="7" height="11" rx="1.5" stroke="#94A3B8" strokeWidth="1" />
          <line x1="275" y1="240" x2="271" y2="255" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="275" y1="240" x2="279" y2="255" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ── Floating hearts / interest indicators ── */}
        <g className="success-heart" style={{ animationDelay: '2.5s' }}>
          <path d="M110 201 C110 199 112 197 114 199 C116 197 118 199 118 201 C118 204 114 206 114 206 C114 206 110 204 110 201 Z" fill="#F59E0B" opacity="0.6" />
        </g>
        <g className="success-heart" style={{ animationDelay: '3.0s' }}>
          <path d="M245 198 C245 196 247 194 249 196 C251 194 253 196 253 198 C253 201 249 203 249 203 C249 203 245 201 245 198 Z" fill="#14B8A6" opacity="0.6" />
        </g>
        <g className="success-heart" style={{ animationDelay: '3.5s' }}>
          <path d="M165 202 C165 200 167 198 169 200 C171 198 173 200 173 202 C173 205 169 207 169 207 C169 207 165 205 165 202 Z" fill="#F59E0B" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
