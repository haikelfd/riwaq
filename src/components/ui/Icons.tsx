import { ComponentType } from 'react';

interface IconProps {
  className?: string;
}

// ─── Category Icons ──────────────────────────────────────────

export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M17 8h1a4 4 0 010 8h-1" />
      <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
      <path d="M6 2v3" />
      <path d="M10 2v3" />
      <path d="M14 2v3" />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

export function SnowflakeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4.93 4.93l14.14 14.14" />
      <path d="M19.07 4.93L4.93 19.07" />
      <path d="M12 6l-2-2m2 2l2-2" />
      <path d="M12 18l-2 2m2-2l2 2" />
      <path d="M6 12l-2-2m2 2l-2 2" />
      <path d="M18 12l2-2m-2 2l2 2" />
    </svg>
  );
}

export function ChairIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M6 19v3" />
      <path d="M18 19v3" />
      <path d="M4 15h16" />
      <path d="M4 15V5a2 2 0 012-2h12a2 2 0 012 2v10" />
      <path d="M4 15v4h16v-4" />
    </svg>
  );
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function CroissantIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M4.6 13.11l5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11z" />
      <path d="M10.39 9.9l1.47-5.87a2 2 0 013.86 0l1.47 5.87" />
      <path d="M3.3 11.72l5.87-1.47a2 2 0 010 3.86l-5.87 1.47" />
      <path d="M20.7 12.28l-5.87 1.47a2 2 0 010-3.86l5.87-1.47" />
    </svg>
  );
}

// ─── Stats / Utility Icons ───────────────────────────────────

export function FolderIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.962 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.582a.5.5 0 010 .962L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.962 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M11 17l-1.5 1.5a2.12 2.12 0 01-3-3L10 12" />
      <path d="M15.5 7.5L18 10l-4.5 4.5" />
      <path d="M2 9l5-5 4 4-5 5z" />
      <path d="M13 6l5 5 4-4-5-5z" />
      <path d="M2 9l3 3" />
      <path d="M22 10l-3 3" />
    </svg>
  );
}

export function PackageIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

// ─── Persona & Form Icons ────────────────────────────────────

export function ChefHatIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M17 21H7" />
      <path d="M17 17H7" />
      <path d="M17 17V9a5 5 0 00-2-4 5 5 0 00-6 0 5 5 0 00-2 4v8" />
      <path d="M7 9a5 5 0 010-4c1.5-1 3.5-1 5-1s3.5 0 5 1a5 5 0 010 4" />
    </svg>
  );
}

export function RecycleIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 000-1.775l-1.226-2.12" />
      <path d="M14 16l3-3-3-3" />
      <path d="M8.293 13.596L4.875 7.97a1.83 1.83 0 01.009-1.784A1.784 1.784 0 016.45 5.33L9.6 5.2" />
      <path d="M7 19l-2-3.5" />
      <path d="M12 2l2 3.5" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function HandIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M18 11V6a2 2 0 00-4 0v1" />
      <path d="M14 10V4a2 2 0 00-4 0v2" />
      <path d="M10 10.5V6a2 2 0 00-4 0v8" />
      <path d="M18 8a2 2 0 014 0v6a8 8 0 01-8 8H12a8 8 0 01-8-8V8" />
    </svg>
  );
}

export function CircleHalfIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M12 2a10 10 0 010 20" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M3 9l1-4h16l1 4" />
      <path d="M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9" />
      <path d="M3 9h18" />
      <path d="M9 21V13h6v8" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

// ─── Subcategory Icons ───────────────────────────────────────

export function EspressoIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M5 8h12v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
      <path d="M17 11h2a2 2 0 010 4h-2" />
      <path d="M8 4v2" />
      <path d="M12 3v3" />
      <path d="M3 21h16" />
    </svg>
  );
}

export function GrinderIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M7 3h10l-2 6H9L7 3z" />
      <rect x="8" y="9" width="8" height="6" rx="1" />
      <path d="M10 15v4h4v-4" />
      <path d="M8 21h8" />
      <path d="M17 3l2-1" />
    </svg>
  );
}

export function OvenIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="10" width="12" height="8" rx="1" />
      <path d="M8 6h0" />
      <path d="M12 6h0" />
      <path d="M16 6h0" />
    </svg>
  );
}

export function FryerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 2v4" />
      <path d="M12 2v4" />
      <path d="M16 2v4" />
      <path d="M8 14h8" />
    </svg>
  );
}

export function GrillIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 12h10" />
      <path d="M7 15h10" />
      <path d="M7 4l2 4" />
      <path d="M12 3v5" />
      <path d="M17 4l-2 4" />
    </svg>
  );
}

export function FridgeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 10h14" />
      <path d="M9 6v2" />
      <path d="M9 14v4" />
    </svg>
  );
}

export function FreezerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M5 12h14" />
      <path d="M9 7v2" />
      <path d="M12 15l-2 2m2-2l2 2m-2-2v3" />
    </svg>
  );
}

export function DisplayCaseIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M3 8h18v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
      <path d="M5 4h14a2 2 0 012 2v2H3V6a2 2 0 012-2z" />
      <path d="M3 14h18" />
      <path d="M8 8v13" />
    </svg>
  );
}

export function IceCubeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
      <path d="M8 7h0" />
      <path d="M16 17h0" />
    </svg>
  );
}

export function TableIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M3 9h18" />
      <path d="M5 9v9" />
      <path d="M19 9v9" />
      <path d="M3 9l1-4h16l1 4" />
    </svg>
  );
}

export function StoolIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M8 11l-2 10" />
      <path d="M16 11l2 10" />
      <path d="M12 11v10" />
      <path d="M7 18h10" />
    </svg>
  );
}

export function CounterIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M3 10h18v2H3z" />
      <path d="M5 12v8" />
      <path d="M19 12v8" />
      <path d="M3 10V6a2 2 0 012-2h14a2 2 0 012 2v4" />
      <path d="M10 15h4v5h-4z" />
    </svg>
  );
}

export function ShelfIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M4 3v18" />
      <path d="M20 3v18" />
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function DishwasherIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <circle cx="8" cy="6" r="1" />
      <circle cx="12" cy="6" r="1" />
      <circle cx="12" cy="15" r="3" />
    </svg>
  );
}

export function HoodIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M4 14h16l-2-8H6L4 14z" />
      <path d="M4 14v4h16v-4" />
      <path d="M10 3v3" />
      <path d="M14 3v3" />
      <path d="M9 18v3" />
      <path d="M15 18v3" />
    </svg>
  );
}

export function ScaleIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M12 3v18" />
      <path d="M3 7l4 9h10l4-9" />
      <circle cx="7" cy="16" r="3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M8 3h8" />
    </svg>
  );
}

export function SlicerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 19h18" />
      <path d="M12 4V2" />
    </svg>
  );
}

export function CashRegisterIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M4 15h16v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5z" />
      <path d="M4 15l2-8h12l2 8" />
      <path d="M9 10h6" />
      <path d="M8 7h8" />
      <path d="M14 18h2" />
    </svg>
  );
}

export function MixerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M14 4l-4 8h6l-4 8" />
      <circle cx="12" cy="18" r="3" />
      <path d="M8 21h8" />
      <path d="M10 4h4" />
    </svg>
  );
}

export function RollingPinIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M3 7l4-4 14 14-4 4z" />
      <path d="M7 3l-4 4" />
      <path d="M17 13l4-4" />
    </svg>
  );
}

export function RiseIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M12 8V5" />
      <path d="M8 5c0 0 1-3 4-3s4 3 4 3" />
      <path d="M8 14h8" />
      <path d="M8 17h8" />
    </svg>
  );
}

export function CookingPotIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M5 10h14v8a3 3 0 01-3 3H8a3 3 0 01-3-3v-8z" />
      <path d="M3 10h18" />
      <path d="M8 5v3" />
      <path d="M12 4v4" />
      <path d="M16 5v3" />
    </svg>
  );
}

export function FilterCoffeeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M6 6h12l-3 12H9L6 6z" />
      <path d="M4 6h16" />
      <path d="M12 18v3" />
      <path d="M8 21h8" />
      <path d="M9 2v2" />
      <path d="M15 2v2" />
    </svg>
  );
}

// ─── Additional Subcategory Icons ────────────────────────────

export function BlenderIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M9 18l1-8h4l1 8" />
      <path d="M10 10V5a1 1 0 011-1h2a1 1 0 011 1v5" />
      <path d="M15 4h2" />
      <path d="M12 7h0" />
    </svg>
  );
}

export function JuicerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M12 3v2" />
      <path d="M9 8a3 3 0 016 0" />
      <path d="M8 13h8l-1 7H9l-1-7z" />
      <path d="M10 21h4" />
    </svg>
  );
}

export function DispenserIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="5" y="3" width="14" height="14" rx="2" />
      <path d="M5 10h14" />
      <path d="M10 17v4" />
      <path d="M14 17v4" />
      <path d="M8 6h8" />
      <path d="M12 13v1" />
    </svg>
  );
}

export function ToasterIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M7 8V5" />
      <path d="M12 8V6" />
      <path d="M17 8V5" />
      <path d="M7 12h4" />
      <path d="M13 12h4" />
      <path d="M6 18v2" />
      <path d="M18 18v2" />
    </svg>
  );
}

export function RotisserieIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <ellipse cx="12" cy="14" rx="4" ry="2" />
      <path d="M8 14h8" />
      <path d="M6 18v2" />
      <path d="M18 18v2" />
    </svg>
  );
}

export function IceCreamIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M12 21l-4-12h8l-4 12z" />
      <circle cx="8" cy="6" r="3" />
      <circle cx="16" cy="6" r="3" />
      <circle cx="12" cy="4" r="3" />
    </svg>
  );
}

export function WaterDropIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" />
      <path d="M12 18a3 3 0 01-3-3" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M5 4h16v12H5z" />
      <path d="M5 10h16" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M5 16v1" />
      <path d="M21 16v1" />
    </svg>
  );
}

export function ParasolIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M12 2v20" />
      <path d="M3 10a9 9 0 0118 0" />
      <path d="M3 10h18" />
      <path d="M8 22h8" />
    </svg>
  );
}

export function ProcessorIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M6 10a6 6 0 1012 0v-1a3 3 0 00-3-3h-6a3 3 0 00-3 3v1z" />
      <path d="M6 10h12" />
      <path d="M10 10l2-3 2 3" />
      <path d="M8 16h8l1 5H7l1-5z" />
    </svg>
  );
}

export function VacuumSealIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="8" rx="2" />
      <path d="M3 8h18" />
      <path d="M7 12v6a1 1 0 001 1h8a1 1 0 001-1v-6" />
      <path d="M9 15h6" />
      <path d="M12 6h0" />
    </svg>
  );
}

export function SinkIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M12 3v5" />
      <path d="M14 3a2 2 0 012 2v3" />
      <path d="M3 10h18v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3z" />
      <path d="M5 17v4" />
      <path d="M19 17v4" />
      <path d="M12 17v4" />
    </svg>
  );
}

export function PastaIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <path d="M5 10h14v8a3 3 0 01-3 3H8a3 3 0 01-3-3v-8z" />
      <path d="M3 10h18" />
      <path d="M8 10c0-4 1-7 4-7s4 3 4 7" />
      <path d="M10 14v3" />
      <path d="M14 14v3" />
    </svg>
  );
}

export function TrayIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
      strokeLinejoin="round" className={className}>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M6 13v5" />
      <path d="M18 13v5" />
      <path d="M3 18h18" />
      <path d="M8 8V6h8v2" />
    </svg>
  );
}

// ─── Category & Subcategory Icon Lookup ──────────────────────

const CATEGORY_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  coffee: CoffeeIcon,
  flame: FlameIcon,
  snowflake: SnowflakeIcon,
  chair: ChairIcon,
  wrench: WrenchIcon,
  croissant: CroissantIcon,
  // Subcategory icons
  espresso: EspressoIcon,
  grinder: GrinderIcon,
  'filter-coffee': FilterCoffeeIcon,
  percolator: CookingPotIcon,
  blender: BlenderIcon,
  juicer: JuicerIcon,
  dispenser: DispenserIcon,
  oven: OvenIcon,
  fryer: FryerIcon,
  grill: GrillIcon,
  'cooking-pot': CookingPotIcon,
  toaster: ToasterIcon,
  rotisserie: RotisserieIcon,
  pasta: PastaIcon,
  fridge: FridgeIcon,
  freezer: FreezerIcon,
  'display-case': DisplayCaseIcon,
  'ice-cube': IceCubeIcon,
  'ice-cream': IceCreamIcon,
  'water-drop': WaterDropIcon,
  table: TableIcon,
  stool: StoolIcon,
  counter: CounterIcon,
  shelf: ShelfIcon,
  cart: CartIcon,
  parasol: ParasolIcon,
  dishwasher: DishwasherIcon,
  hood: HoodIcon,
  scale: ScaleIcon,
  slicer: SlicerIcon,
  'cash-register': CashRegisterIcon,
  processor: ProcessorIcon,
  'vacuum-seal': VacuumSealIcon,
  sink: SinkIcon,
  tray: TrayIcon,
  mixer: MixerIcon,
  'rolling-pin': RollingPinIcon,
  rise: RiseIcon,
  // Persona
  'chef-hat': ChefHatIcon,
  // Utility
  bolt: BoltIcon,
  hand: HandIcon,
  store: StoreIcon,
  truck: TruckIcon,
  globe: GlobeIcon,
  sparkles: SparklesIcon,
  recycle: RecycleIcon,
  'circle-half': CircleHalfIcon,
};

export function getCategoryIcon(iconId: string): ComponentType<IconProps> {
  return CATEGORY_ICON_MAP[iconId] || PackageIcon;
}
