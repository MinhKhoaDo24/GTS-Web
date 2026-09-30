import React from 'react'

interface LogoProps {
  className?: string
}

/** 1. CISCO SYSTEMS */
export function CiscoLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" fill="currentColor" className={className}>
      <g fill="#049FD9">
        <rect x="10" y="22" width="4" height="10" rx="2" />
        <rect x="22" y="16" width="4" height="16" rx="2" />
        <rect x="34" y="24" width="4" height="8" rx="2" />
        <rect x="46" y="10" width="4" height="22" rx="2" />
        <rect x="58" y="24" width="4" height="8" rx="2" />
        <rect x="70" y="16" width="4" height="16" rx="2" />
        <rect x="82" y="22" width="4" height="10" rx="2" />
      </g>
      <text x="18" y="38" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="currentColor" letterSpacing="2">
        CISCO
      </text>
    </svg>
  )
}

/** 2. FORTINET */
export function FortinetLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 140 36" fill="currentColor" className={className}>
      <g fill="#EE3124">
        <rect x="2" y="6" width="7" height="7" rx="1.5" />
        <rect x="11" y="6" width="7" height="7" rx="1.5" />
        <rect x="2" y="15" width="7" height="7" rx="1.5" />
        <rect x="11" y="15" width="7" height="7" rx="1.5" />
        <rect x="2" y="24" width="7" height="7" rx="1.5" />
        <rect x="11" y="24" width="7" height="7" rx="1.5" />
      </g>
      <text x="26" y="25" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fill="currentColor" letterSpacing="1.5">
        FORTINET
      </text>
    </svg>
  )
}

/** 3. HPE ARUBA */
export function HpeArubaLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 150 36" fill="currentColor" className={className}>
      <rect x="2" y="8" width="22" height="12" fill="none" stroke="#01A982" strokeWidth="4" />
      <text x="32" y="18" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="800" fill="currentColor">
        Hewlett Packard
      </text>
      <text x="32" y="29" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="#FF8300" letterSpacing="0.5">
        aruba
      </text>
    </svg>
  )
}

/** 4. DELL TECHNOLOGIES */
export function DellLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 150 36" fill="currentColor" className={className}>
      <circle cx="16" cy="18" r="14" fill="none" stroke="#007DB8" strokeWidth="3" />
      <text x="7" y="23" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="#007DB8" fontStyle="italic">
        D
      </text>
      <text x="38" y="24" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="currentColor" letterSpacing="1">
        DELL <tspan fontSize="10" fontWeight="600" fill="currentColor">Technologies</tspan>
      </text>
    </svg>
  )
}

/** 5. UBIQUITI NETWORKS */
export function UbiquitiLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 130 36" fill="currentColor" className={className}>
      <path d="M6 10 C6 6, 22 6, 22 10 L22 22 C22 27, 6 27, 6 22 Z" fill="none" stroke="#0559C9" strokeWidth="3" />
      <circle cx="14" cy="18" r="3" fill="#0559C9" />
      <text x="30" y="24" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="800" fill="currentColor" letterSpacing="1">
        UBIQUITI
      </text>
    </svg>
  )
}

/** 6. RUIJIE REYEE */
export function RuijieLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 130 36" fill="currentColor" className={className}>
      <path d="M4 8 L18 8 C24 8, 24 18, 18 18 L10 18 L20 28" fill="none" stroke="#E60012" strokeWidth="3.5" strokeLinecap="round" />
      <text x="28" y="24" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="currentColor">
        Ruijie <tspan fill="#E60012">Reyee</tspan>
      </text>
    </svg>
  )
}

/** 7. MIKROTIK */
export function MikrotikLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 36" fill="currentColor" className={className}>
      <path d="M4 26 L10 10 L16 26 L22 10 L28 26" fill="none" stroke="#D32F2F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="34" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="currentColor" letterSpacing="0.5">
        MikroTik
      </text>
    </svg>
  )
}

/** 8. GRANDSTREAM */
export function GrandstreamLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 140 36" fill="currentColor" className={className}>
      <circle cx="12" cy="18" r="8" fill="#0275D8" />
      <path d="M12 12 A6 6 0 0 1 18 18" fill="none" stroke="#ffffff" strokeWidth="2" />
      <text x="26" y="24" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="800" fill="currentColor" letterSpacing="0.5">
        GRANDSTREAM
      </text>
    </svg>
  )
}

/** 9. JUNIPER NETWORKS */
export function JuniperLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 130 36" fill="currentColor" className={className}>
      <rect x="4" y="10" width="16" height="16" rx="3" fill="#25A244" />
      <text x="26" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="currentColor" letterSpacing="0.5">
        Juniper
      </text>
    </svg>
  )
}

/** 10. APC BY SCHNEIDER */
export function ApcLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 110 36" fill="currentColor" className={className}>
      <path d="M6 26 L14 8 L22 26 L18 26 L14 16 L10 26 Z" fill="#D32F2F" />
      <text x="28" y="24" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fill="currentColor" letterSpacing="1">
        APC
      </text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// KHÁCH HÀNG DOANH NGHIỆP TIÊU BIỂU
// ─────────────────────────────────────────────────────────────────────────────

/** 1. VIETCOMBANK */
export function VietcombankLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 150 36" fill="currentColor" className={className}>
      <polygon points="12,6 22,26 2,26" fill="#006633" />
      <polygon points="12,12 18,24 6,24" fill="#8DC63F" />
      <text x="28" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="#006633" letterSpacing="0.5">
        Vietcombank
      </text>
    </svg>
  )
}

/** 2. MB BANK */
export function MbBankLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 36" fill="currentColor" className={className}>
      <g>
        <path d="M6 18 L16 8 L16 28 Z" fill="#EE2E24" />
        <path d="M26 18 L16 8 L16 28 Z" fill="#005BAA" />
      </g>
      <text x="32" y="25" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" fill="#005BAA" letterSpacing="1">
        MB
      </text>
    </svg>
  )
}

/** 3. VINGROUP */
export function VingroupLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 130 36" fill="currentColor" className={className}>
      <circle cx="12" cy="18" r="9" fill="#ED1C24" />
      <path d="M6 18 Q12 12 18 16 Q12 22 6 18" fill="#FFD200" />
      <text x="26" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="#ED1C24" letterSpacing="0.5">
        VINGROUP
      </text>
    </svg>
  )
}

/** 4. LG INNOTEK */
export function LgInnotekLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 140 36" fill="currentColor" className={className}>
      <circle cx="14" cy="18" r="10" fill="#A50034" />
      <text x="9" y="22" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="900" fill="#ffffff">
        LG
      </text>
      <text x="30" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="currentColor">
        LG Innotek
      </text>
    </svg>
  )
}

/** 5. VIETTEL */
export function ViettelLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 36" fill="currentColor" className={className}>
      <ellipse cx="14" cy="18" rx="10" ry="6" fill="none" stroke="#ED1C24" strokeWidth="2.5" />
      <text x="28" y="24" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fill="#ED1C24" letterSpacing="0.5">
        viettel
      </text>
    </svg>
  )
}

/** 6. FPT SOFTWARE */
export function FptLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 36" fill="currentColor" className={className}>
      <path d="M4 24 L10 10 L16 24 Z" fill="#F37021" />
      <path d="M14 24 L20 10 L26 24 Z" fill="#0054A6" />
      <path d="M24 24 L30 10 L36 24 Z" fill="#009639" />
      <text x="42" y="24" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fill="currentColor" letterSpacing="1">
        FPT
      </text>
    </svg>
  )
}

/** 7. DECATHLON */
export function DecathlonLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 140 36" fill="currentColor" className={className}>
      <rect x="2" y="6" width="136" height="24" rx="4" fill="#0082C3" />
      <text x="12" y="23" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="#ffffff" letterSpacing="2">
        DECATHLON
      </text>
    </svg>
  )
}

/** 8. PETROVIETNAM */
export function PetrovietnamLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 150 36" fill="currentColor" className={className}>
      <path d="M12 6 C12 6, 4 14, 4 20 C4 24, 7 28, 12 28 C17 28, 20 24, 20 20 C20 14, 12 6, 12 6 Z" fill="#006699" />
      <path d="M12 12 C12 12, 7 16, 7 20 C7 23, 9 25, 12 25 C15 25, 17 23, 17 20 C17 16, 12 12, 12 12 Z" fill="#ED1C24" />
      <text x="26" y="24" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#006699" letterSpacing="0.5">
        PETROVIETNAM
      </text>
    </svg>
  )
}

/** 9. VINMEC HEALTHCARE */
export function VinmecLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 130 36" fill="currentColor" className={className}>
      <circle cx="12" cy="18" r="9" fill="#0072BA" />
      <rect x="10" y="12" width="4" height="12" fill="#ffffff" />
      <rect x="6" y="16" width="12" height="4" fill="#ffffff" />
      <text x="26" y="24" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="#0072BA" letterSpacing="0.5">
        VINMEC
      </text>
    </svg>
  )
}

/** 10. MƯỜNG THANH GROUP */
export function MuongThanhLogo({ className = 'h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 150 36" fill="currentColor" className={className}>
      <circle cx="12" cy="18" r="9" fill="#C59B27" />
      <circle cx="12" cy="18" r="6" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      <text x="26" y="23" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900" fill="#C59B27" letterSpacing="0.5">
        MƯỜNG THANH
      </text>
    </svg>
  )
}
