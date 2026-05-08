'use client';

import { getCategoryIcon } from '@/components/ui/Icons';

interface DeposerIllustrationProps {
  stage: number; // 0-6
  subcategoryIcon?: string;
}

const CAPTIONS = [
  'Choisissez votre produit',
  'Produit sélectionné',
  'Annonce créée',
  'Photos ajoutées',
  'État défini',
  'Prix ajouté',
  'Prêt à publier !',
];

export default function DeposerIllustration({ stage, subcategoryIcon }: DeposerIllustrationProps) {
  const SubcatIcon = subcategoryIcon ? getCategoryIcon(subcategoryIcon) : null;
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 280 260"
        className="w-full max-w-[260px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Base: Table/Surface ── */}
        <g className="text-slate-300">
          {/* Table top */}
          <line x1="40" y1="195" x2="240" y2="195" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Table legs */}
          <line x1="60" y1="195" x2="55" y2="230" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="220" y1="195" x2="225" y2="230" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Shadow */}
          <ellipse cx="140" cy="235" rx="70" ry="4" fill="currentColor" opacity="0.15" />
        </g>

        {/* ── Stage 0: Dotted product outline ── */}
        <g
          className="text-slate-300"
          style={{
            opacity: stage === 0 ? 0.5 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <rect
            x="100" y="130" width="80" height="65" rx="6"
            stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4"
            fill="none"
          />
          <text x="140" y="167" textAnchor="middle" fontSize="10" fill="currentColor" fontFamily="Inter, sans-serif">?</text>
        </g>

        {/* ── Stage 1: Product silhouette ── */}
        <g
          key={`product-${stage >= 1 ? 'in' : 'out'}-${subcategoryIcon || 'default'}`}
          className={stage >= 1 ? 'illus-fade-up' : ''}
          style={{
            opacity: stage >= 1 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {SubcatIcon ? (
            /* Dynamic subcategory icon */
            <>
              {/* Container outline */}
              <rect x="105" y="125" width="70" height="70" rx="10" stroke="#94A3B8" strokeWidth="1" strokeDasharray="0" fill="#F8FAFC" opacity="0.5" />
              {/* Subcategory icon via foreignObject */}
              <foreignObject x="113" y="133" width="54" height="54">
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SubcatIcon className="w-10 h-10 text-slate-500" />
                </div>
              </foreignObject>
            </>
          ) : (
            /* Generic coffee machine fallback */
            <>
              {/* Machine body */}
              <rect x="105" y="130" width="70" height="65" rx="5" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Top section */}
              <rect x="110" y="125" width="60" height="12" rx="3" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Gauge circle */}
              <circle cx="140" cy="155" r="12" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="140" cy="155" r="4" fill="#94A3B8" opacity="0.3" />
              {/* Drip tray */}
              <rect x="118" y="180" width="44" height="8" rx="2" stroke="#94A3B8" strokeWidth="1" />
              {/* Steam lines */}
              <path d="M125 120 Q127 112 125 104" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M140 118 Q142 110 140 102" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M155 120 Q157 112 155 104" stroke="#CBD5E1" strokeWidth="1" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* ── Stage 2: Name tag (hidden at stage 6) ── */}
        <g
          key={stage >= 2 ? 'tag-in' : 'tag-out'}
          className={stage >= 2 && stage < 6 ? 'illus-fade-up' : ''}
          style={{
            opacity: stage >= 2 && stage < 6 ? 1 : 0,
            animationDelay: '0.1s',
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Tag body */}
          <rect x="182" y="138" width="52" height="22" rx="4" stroke="#D97706" strokeWidth="1.5" fill="#FFFBEB" />
          {/* Text lines on tag */}
          <line x1="189" y1="146" x2="220" y2="146" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="189" y1="153" x2="210" y2="153" stroke="#D97706" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          {/* Connection line to product */}
          <line x1="175" y1="149" x2="182" y2="149" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* ── Stage 3: Camera / Photo (hidden at stage 6) ── */}
        <g
          key={stage >= 3 ? 'camera-in' : 'camera-out'}
          className={stage >= 3 && stage < 6 ? 'illus-flash' : ''}
          style={{
            opacity: stage >= 3 && stage < 6 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Camera body */}
          <rect x="42" y="110" width="36" height="28" rx="5" stroke="#D97706" strokeWidth="1.5" />
          {/* Lens */}
          <circle cx="60" cy="124" r="8" stroke="#D97706" strokeWidth="1.5" />
          <circle cx="60" cy="124" r="3" fill="#D97706" opacity="0.2" />
          {/* Flash button */}
          <rect x="50" y="107" width="10" height="5" rx="1.5" stroke="#D97706" strokeWidth="1" />
          {/* Flash burst lines */}
          <line x1="84" y1="115" x2="95" y2="110" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="84" y1="124" x2="96" y2="124" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="84" y1="133" x2="95" y2="138" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* ── Stage 4: Condition badge (hidden at stage 6) ── */}
        <g
          key={stage >= 4 ? 'badge-in' : 'badge-out'}
          className={stage >= 4 && stage < 6 ? 'illus-fade-up' : ''}
          style={{
            opacity: stage >= 4 && stage < 6 ? 1 : 0,
            animationDelay: '0.15s',
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Badge circle */}
          <circle cx="112" cy="132" r="11" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="1.5" />
          {/* Checkmark */}
          <path d="M107 132 L110.5 135.5 L117 128.5" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* ── Stage 5: Price tag ── */}
        <g
          key={stage >= 5 ? 'price-in' : 'price-out'}
          className={stage >= 5 ? 'illus-tag-swing' : ''}
          style={{
            opacity: stage >= 5 ? 1 : 0,
          }}
        >
          {/* String */}
          <path d="M155 130 Q160 140 158 148" stroke="#D97706" strokeWidth="1" fill="none" />
          {/* Tag shape */}
          <path
            d="M148 148 L168 148 L172 158 L168 168 L148 168 L148 148 Z"
            fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5"
          />
          {/* Hole */}
          <circle cx="152" cy="153" r="2" stroke="#D97706" strokeWidth="1" fill="none" />
          {/* TND text */}
          <text x="160" y="162" textAnchor="middle" fontSize="8" fill="#D97706" fontFamily="Inter, sans-serif" fontWeight="600">TND</text>
        </g>

        {/* ── Stage 6: Enhanced vitrine + checkmark + sparkles ── */}
        <g
          key={stage >= 6 ? 'shelf-in' : 'shelf-out'}
          className={stage >= 6 ? 'illus-shelf-grow' : ''}
          style={{
            opacity: stage >= 6 ? 1 : 0,
          }}
        >
          {/* Glass back panel */}
          <rect x="35" y="85" width="210" height="115" rx="6" stroke="#D97706" strokeWidth="1" fill="#FFFBEB" opacity="0.2" />
          <rect x="38" y="88" width="204" height="109" rx="4" stroke="#D97706" strokeWidth="0.5" fill="none" opacity="0.15" />
          {/* Top decorative bar */}
          <rect x="32" y="82" width="216" height="8" rx="2" fill="#D97706" opacity="0.1" />
          <line x1="32" y1="90" x2="248" y2="90" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          {/* Side pillars */}
          <line x1="38" y1="90" x2="38" y2="195" stroke="#D97706" strokeWidth="0.8" opacity="0.2" />
          <line x1="242" y1="90" x2="242" y2="195" stroke="#D97706" strokeWidth="0.8" opacity="0.2" />
          {/* Shelf brackets */}
          <path d="M42 195 L42 185 L55 185" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M238 195 L238 185 L225 185" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          {/* Spotlight glow */}
          <ellipse cx="140" cy="155" rx="40" ry="30" fill="#D97706" opacity="0.04" />
          {/* Glass reflection */}
          <line x1="48" y1="98" x2="48" y2="135" stroke="white" strokeWidth="0.5" opacity="0.12" />
        </g>

        {/* Stage 6: Verified checkmark badge */}
        {stage >= 6 && (
          <g className="illus-fade-up" style={{ animationDelay: '0.3s' }}>
            <circle cx="140" cy="105" r="13" fill="#F0FDFA" stroke="#14B8A6" strokeWidth="1.5" />
            <path d="M134 105 L138 109 L146 100" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        {/* Sparkles (separate so they loop) */}
        {stage >= 6 && (
          <g>
            <g className="illus-sparkle" style={{ animationDelay: '0s' }}>
              <path d="M50 100 L53 95 L56 100 L53 105 Z" fill="#F59E0B" />
            </g>
            <g className="illus-sparkle" style={{ animationDelay: '0.5s' }}>
              <path d="M220 98 L223 93 L226 98 L223 103 Z" fill="#14B8A6" />
            </g>
            <g className="illus-sparkle" style={{ animationDelay: '1s' }}>
              <path d="M190 80 L192 76 L194 80 L192 84 Z" fill="#F59E0B" />
            </g>
            <g className="illus-sparkle" style={{ animationDelay: '0.3s' }}>
              <path d="M75 88 L77 84 L79 88 L77 92 Z" fill="#14B8A6" />
            </g>
          </g>
        )}

        {/* ── Progress dots ── */}
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle
              key={i}
              cx={98 + i * 14}
              cy="250"
              r="3"
              fill={i <= stage ? '#D97706' : '#E2E8F0'}
              style={{ transition: 'fill 0.3s ease' }}
            />
          ))}
        </g>
      </svg>

      {/* Caption */}
      <p
        key={stage}
        className="text-sm font-medium text-slate-400 mt-2 sidebar-content-enter"
      >
        {CAPTIONS[stage]}
      </p>
    </div>
  );
}
