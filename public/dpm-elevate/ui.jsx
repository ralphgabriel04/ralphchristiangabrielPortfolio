/* global React */
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* ============================================================
   ICONS — outline, Lucide-style, 24×24 viewbox
============================================================ */
const Ico = ({ d, size = 16, stroke = 2, className = "", fill = "none", viewBox = "0 0 24 24", style }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
       className={className} style={style} aria-hidden="true">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  Home: (p) => <Ico {...p} d={<><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></>} />,
  Layout: (p) => <Ico {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 12h6"/></>} />,
  Calendar: (p) => <Ico {...p} d={<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></>} />,
  Sunrise: (p) => <Ico {...p} d={<><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v7M4.93 10.93l1.41 1.41M2 18h2M20 18h2M17.66 12.34l1.41-1.41M22 22H2M8 6l4-4 4 4"/></>} />,
  Target: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>} />,
  ListChecks: (p) => <Ico {...p} d={<><path d="M3 17l2 2 4-4"/><path d="M3 7l2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/></>} />,
  Star: (p) => <Ico {...p} d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>,
  Check: (p) => <Ico {...p} d="M20 6 9 17l-5-5"/>,
  CheckSquare: (p) => <Ico {...p} d={<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>} />,
  Grid: (p) => <Ico {...p} d={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>} />,
  Flame: (p) => <Ico {...p} d="M8.5 14.5C5 12 7 7 7 7s2 3 5 3-2-7 3-7c0 4 4 5 4 9a6 6 0 0 1-12 0c0-1 .5-2 1.5-2.5z"/>,
  Shield: (p) => <Ico {...p} d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/>,
  BarChart: (p) => <Ico {...p} d={<><path d="M3 21V3"/><path d="M3 21h18"/><rect x="7" y="13" width="3" height="6"/><rect x="12" y="9" width="3" height="10"/><rect x="17" y="5" width="3" height="14"/></>} />,
  Activity: (p) => <Ico {...p} d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
  Settings: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>} />,
  Plus: (p) => <Ico {...p} d="M12 5v14M5 12h14"/>,
  Minus: (p) => <Ico {...p} d="M5 12h14"/>,
  Search: (p) => <Ico {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  Bell: (p) => <Ico {...p} d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>,
  Filter: (p) => <Ico {...p} d="M22 3H2l8 10v6l4 2v-8z"/>,
  ChevronLeft: (p) => <Ico {...p} d="m15 18-6-6 6-6"/>,
  ChevronRight: (p) => <Ico {...p} d="m9 18 6-6-6-6"/>,
  ChevronDown: (p) => <Ico {...p} d="m6 9 6 6 6-6"/>,
  ChevronUp: (p) => <Ico {...p} d="m6 15 6-6 6 6"/>,
  X: (p) => <Ico {...p} d="M18 6 6 18M6 6l12 12"/>,
  Menu: (p) => <Ico {...p} d="M4 6h16M4 12h16M4 18h16"/>,
  Moon: (p) => <Ico {...p} d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>,
  Sun: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>} />,
  Clock: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  Zap: (p) => <Ico {...p} d="M13 2 3 14h7l-1 8 10-12h-7z"/>,
  Play: (p) => <Ico {...p} d="M5 3v18l15-9z"/>,
  Pause: (p) => <Ico {...p} d="M6 4h4v16H6zM14 4h4v16h-4z"/>,
  SkipForward: (p) => <Ico {...p} d="M5 4l10 8-10 8zM19 5v14"/>,
  SkipBack: (p) => <Ico {...p} d="M19 20 9 12l10-8zM5 19V5"/>,
  Music: (p) => <Ico {...p} d={<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>} />,
  Volume: (p) => <Ico {...p} d={<><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></>} />,
  VolumeX: (p) => <Ico {...p} d={<><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></>} />,
  Headphones: (p) => <Ico {...p} d={<><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 14v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2zM3 14v3a2 2 0 0 0 2 2h1v-7H5a2 2 0 0 0-2 2z"/></>} />,
  Plug: (p) => <Ico {...p} d={<><path d="M12 22v-5M9 8V2M15 8V2M5 8h14v3a7 7 0 0 1-14 0z"/></>} />,
  More: (p) => <Ico {...p} d={<><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></>} />,
  Drag: (p) => <Ico {...p} d={<><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></>} />,
  Sparkles: (p) => <Ico {...p} d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z"/>,
  Cloud: (p) => <Ico {...p} d="M17 18A5 5 0 0 0 16 8.1a7 7 0 0 0-13.6 2A4 4 0 0 0 4 18z"/>,
  Mail: (p) => <Ico {...p} d={<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></>} />,
  Lock: (p) => <Ico {...p} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
  Github: (p) => <Ico {...p} d="M9 19c-4 1.5-4-2-6-2m12 5v-3.5a3 3 0 0 0-.8-2.5c2.8-.3 5.8-1.4 5.8-6.3a4.8 4.8 0 0 0-1.4-3.4 4.5 4.5 0 0 0-.1-3.4s-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C5 2.7 4 3 4 3a4.5 4.5 0 0 0-.1 3.4 4.8 4.8 0 0 0-1.4 3.4c0 4.9 3 6 5.8 6.3a3 3 0 0 0-.8 2.5V22"/>,
  Apple: (p) => <Ico {...p} d="M19 8.5c-1.5-.5-3 0-4 1-1-1-2.5-1.5-4-1-2 .8-3 3-3 5.5 0 4 3 8 5 8 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-4 5-8 0-2.5-1-4.7-3-5.5zM12 4c.5-1.5 2-2.5 3.5-2.5 0 1.5-1.5 3-3 3-.5 0-.5-.3-.5-.5z" fill="currentColor"/>,
  Building: (p) => <Ico {...p} d={<><rect x="4" y="2" width="16" height="20"/><path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2M10 22v-4h4v4"/></>} />,
  Google: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" className={p.className}>
      <path fill="#EA4335" d="M12 11v3.2h4.5a4.5 4.5 0 0 1-1.9 3l3 2.4A8.8 8.8 0 0 0 21 12.2c0-.7-.1-1.3-.2-1.9H12z" transform="translate(0 0)"/>
      <path fill="#4285F4" d="M5.3 14.3 4.5 15l-2.6 2A9 9 0 0 0 12 21c2.4 0 4.5-.8 6-2.2l-3-2.4a5.5 5.5 0 0 1-8-3l-1.7 1z" transform="translate(0 -1)"/>
      <path fill="#FBBC05" d="M1.9 7A9 9 0 0 0 1 12c0 1.4.4 2.8 1 4l3.7-2.9a5.4 5.4 0 0 1 0-2.2L1.9 8z" transform="translate(0 0)"/>
      <path fill="#34A853" d="M12 5.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9 9 0 0 0 12 1.5 9 9 0 0 0 1.9 7l3.7 2.9A5.4 5.4 0 0 1 12 5.4z" transform="translate(0 0)"/>
    </svg>
  ),
  Microsoft: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" className={p.className}>
      <path fill="#F25022" d="M2 2h10v10H2z"/>
      <path fill="#7FBA00" d="M12 2h10v10H12z"/>
      <path fill="#00A4EF" d="M2 12h10v10H2z"/>
      <path fill="#FFB900" d="M12 12h10v10H12z"/>
    </svg>
  ),
  Trash: (p) => <Ico {...p} d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>,
  Edit: (p) => <Ico {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-2-9 3 3L12 18l-4 1 1-4z"/>,
  Copy: (p) => <Ico {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />,
  Share: (p) => <Ico {...p} d={<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4M12 2v13"/></>} />,
  Send: (p) => <Ico {...p} d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>,
  Download: (p) => <Ico {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>,
  AlertTriangle: (p) => <Ico {...p} d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>,
  Inbox: (p) => <Ico {...p} d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>,
  Refresh: (p) => <Ico {...p} d="M21 12A9 9 0 1 1 12 3a9 9 0 0 1 8 4.6M21 3v6h-6"/>,
  ArrowRight: (p) => <Ico {...p} d="M5 12h14M13 5l7 7-7 7"/>,
  ArrowUp: (p) => <Ico {...p} d="M5 10l7-7 7 7M12 3v18"/>,
  ArrowDown: (p) => <Ico {...p} d="M19 14l-7 7-7-7M12 3v18"/>,
  Heart: (p) => <Ico {...p} d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.7l-1.06-1.1a5.5 5.5 0 0 0-7.78 7.78l1.06 1.1L12 21.2l7.78-7.72 1.06-1.1a5.5 5.5 0 0 0 0-7.78z"/>,
  Book: (p) => <Ico {...p} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5V21h16"/>,
  Run: (p) => <Ico {...p} d={<><circle cx="13" cy="4" r="2"/><path d="M4 22l4-7 4 2 3-3 4 4M6 11l3-3 3 1 2-3"/></>} />,
  Pen: (p) => <Ico {...p} d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>,
  Coffee: (p) => <Ico {...p} d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3"/>,
  Brain: (p) => <Ico {...p} d="M12 2a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 1 5h10a3 3 0 0 0 1-5 3 3 0 0 0 0-6 3 3 0 0 0-3-3 3 3 0 0 0-3-3z"/>,
  Bird: (p) => <Ico {...p} d="M16 7h.01M3.5 18a3 3 0 0 1 0-6h7l4-7v8a5 5 0 0 1-5 5z"/>,
  Owl: (p) => <Ico {...p} d={<><circle cx="9" cy="11" r="2.5"/><circle cx="15" cy="11" r="2.5"/><path d="M12 2C7 2 4 6 4 11v5a6 6 0 0 0 16 0v-5c0-5-3-9-8-9zM10 18l-2 3M14 18l2 3M12 14v3"/></>} />,
  CornerDown: (p) => <Ico {...p} d="M9 10l-5 5 5 5M20 4v7a4 4 0 0 1-4 4H4"/>,
  Trending: (p) => <Ico {...p} d="M22 7l-9 9-5-5L1 17M16 7h6v6"/>,
  Eye: (p) => <Ico {...p} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></>} />,
  PlusCircle: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>} />,
  Save: (p) => <Ico {...p} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"/>,
  Mic: (p) => <Ico {...p} d={<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/></>} />,
  HelpCircle: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>} />,
  PlayCircle: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z" fill="currentColor"/></>} />,
  Users: (p) => <Ico {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  Smartphone: (p) => <Ico {...p} d={<><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></>} />,
  Compass: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z" fill="currentColor"/></>} />,
  Layers: (p) => <Ico {...p} d={<><path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>} />,
  Globe: (p) => <Ico {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></>} />,
  Briefcase: (p) => <Ico {...p} d={<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20"/></>} />,
  GraduationCap: (p) => <Ico {...p} d={<><path d="M22 9 12 5 2 9l10 4 10-4z"/><path d="M6 11v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5"/></>} />,
  Plane: (p) => <Ico {...p} d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8L8 11l-2 2-2-.5-1 1 3 2 2 3 1-1L8.5 15l2-2 3.7 3.7a.5.5 0 0 0 .8-.5z"/>,
  Home2: (p) => <Ico {...p} d={<><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></>} />,
  Maximize: (p) => <Ico {...p} d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />,
  Minimize: (p) => <Ico {...p} d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M21 16h-3a2 2 0 0 0-2 2v3M3 16h3a2 2 0 0 1 2 2v3" />,
};

/* ============================================================
   UI Primitives
============================================================ */
const cn = (...args) => args.filter(Boolean).join(" ");

function Button({ variant = "primary", size = "md", className = "", children, icon: Icon, iconRight: IconR, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-[8px] focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap";
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-[14px]",
    lg: "h-12 px-5 text-[14px]",
    icon: "h-9 w-9",
    iconSm: "h-8 w-8",
  };
  const variants = {
    primary: "bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.9)] shadow-sm",
    secondary: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.7)]",
    outline: "border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]",
    ghost: "hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]",
    destructive: "bg-[hsl(var(--destructive)/0.15)] text-[hsl(0_84%_70%)] border border-[hsl(var(--destructive)/0.3)] hover:bg-[hsl(var(--destructive)/0.25)]",
    link: "text-[hsl(var(--primary))] hover:underline",
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
      {IconR && <IconR size={size === "sm" ? 14 : 16} />}
    </button>
  );
}

function Card({ className = "", children, padding = "p-5", interactive = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]",
        padding,
        interactive && "hover:border-[hsl(var(--primary)/0.3)] hover:shadow-lg cursor-pointer transition-all duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, action, className = "" }) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <h3 className="text-[13px] font-medium text-[hsl(var(--muted-foreground))]">{children}</h3>
      {action}
    </div>
  );
}

function Badge({ children, variant = "muted", className = "", dot = false }) {
  const variants = {
    muted: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
    primary: "bg-[hsl(var(--primary)/0.12)] text-[hsl(263_70%_75%)]",
    success: "bg-[hsl(142_70%_45%/0.12)] text-[hsl(142_70%_60%)]",
    warning: "bg-[hsl(38_92%_50%/0.12)] text-[hsl(38_92%_60%)]",
    danger:  "bg-[hsl(0_84%_60%/0.12)] text-[hsl(0_84%_70%)]",
    orange:  "bg-[hsl(20_90%_55%/0.12)] text-[hsl(20_90%_65%)]",
    info:    "bg-[hsl(217_91%_60%/0.12)] text-[hsl(217_91%_70%)]",
  };
  const dotColors = {
    muted: "bg-[hsl(var(--muted-foreground))]",
    primary: "bg-[hsl(var(--primary))]",
    success: "bg-[hsl(142_70%_50%)]",
    warning: "bg-[hsl(38_92%_55%)]",
    danger:  "bg-[hsl(0_84%_60%)]",
    orange:  "bg-[hsl(20_90%_55%)]",
    info:    "bg-[hsl(217_91%_60%)]",
  };
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
      variants[variant], className
    )}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </span>
  );
}

function Input({ className = "", icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />}
      <input
        className={cn(
          "w-full h-10 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))]",
          "text-[14px] placeholder:text-[hsl(var(--muted-foreground))]",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent",
          "transition-all duration-150",
          Icon ? "pl-9 pr-3" : "px-3",
          className
        )}
        {...props}
      />
    </div>
  );
}

function Checkbox({ checked, onChange, className = "" }) {
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0",
        checked
          ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]"
          : "border-[hsl(var(--muted-foreground)/0.4)] hover:border-[hsl(var(--primary))]",
        className
      )}
    >
      {checked && <Icons.Check size={12} stroke={3} className="text-white" />}
    </button>
  );
}

function Switch({ checked, onChange, size = "md" }) {
  const dims = size === "sm" ? { track: "h-4 w-7", thumb: "h-3 w-3", trans: checked ? "translate-x-3" : "translate-x-0" }
                              : { track: "h-5 w-9", thumb: "h-4 w-4", trans: checked ? "translate-x-4" : "translate-x-0" };
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative rounded-full transition-colors duration-200 p-0.5 flex items-center",
        dims.track,
        checked ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]"
      )}
    >
      <span className={cn("rounded-full bg-white shadow-sm transition-transform duration-200", dims.thumb, dims.trans)} />
    </button>
  );
}

function Avatar({ name = "RG", size = 32, className = "" }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-full bg-gradient-to-br from-[hsl(263_70%_60%)] to-[hsl(330_80%_60%)] text-white flex items-center justify-center font-semibold flex-shrink-0",
        className
      )}
    >
      <span style={{ fontSize: size * 0.4 }}>{name}</span>
    </div>
  );
}

function Logo({ size = 32, withText = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="assets/logo-dark.png"
        alt="DPM Elevate"
        width={size} height={size}
        style={{ width: size, height: size }}
        className="rounded-[8px] object-contain flex-shrink-0"
      />
      {withText && (
        <div>
          <div className="font-semibold text-[15px] tracking-tight leading-none">DPM</div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))] tracking-[0.1em] uppercase leading-none mt-0.5">Elevate</div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "primary", height = "h-2", className = "" }) {
  const colors = {
    primary: "bg-[hsl(var(--primary))]",
    success: "bg-[hsl(142_70%_50%)]",
    warning: "bg-[hsl(38_92%_55%)]",
    danger:  "bg-[hsl(0_84%_60%)]",
    info:    "bg-[hsl(217_91%_60%)]",
  };
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("rounded-full bg-[hsl(var(--muted))] overflow-hidden", height, className)}>
      <div className={cn("h-full rounded-full transition-all duration-300", colors[color])} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Ring({ value = 0, size = 120, stroke = 8, color = "var(--primary)", trackColor = "var(--muted)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: "block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`hsl(${trackColor})`} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`hsl(${color})`} strokeWidth={stroke}
                strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 400ms ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function ViewToggle({ value, onChange, options }) {
  return (
    <div className="dpm-segment inline-flex items-center gap-0.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "px-3 h-8 text-[12.5px] font-medium rounded-[6px] transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0",
            value === o.value
              ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
              : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          {o.icon && <o.icon size={13} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon = Icons.Inbox, title, subtitle, cta, ctaIcon = Icons.Plus, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4 text-[hsl(var(--muted-foreground))]">
        <Icon size={22} />
      </div>
      <p className="font-medium text-[15px] mb-1">{title}</p>
      <p className="text-[13px] text-[hsl(var(--muted-foreground))] mb-5 max-w-xs">{subtitle}</p>
      {cta && <Button onClick={onCta} icon={ctaIcon}>{cta}</Button>}
    </div>
  );
}

/* ============================================================
   EditableTitle — double-click a label to inline-rename.
   - `value`           current value
   - `onCommit(next)`  called with trimmed new value when the user confirms
   - `className`       passes through to the rendered <span> AND <input>
   - `multiline`       if true, uses textarea
   - `placeholder`     placeholder for the input
   The element stays in view while editing — Enter commits, Esc cancels,
   blur commits. The user never has to "click somewhere else" to save.
============================================================ */
function EditableTitle({ value, onCommit, className = "", multiline = false, placeholder = "", title }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (!editing) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (inputRef.current?.select) inputRef.current.select();
    });
  }, [editing]);

  const commit = () => {
    const next = (draft || "").trim();
    if (next && next !== value) onCommit?.(next);
    else setDraft(value);
    setEditing(false);
  };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); }
            if (e.key === "Escape") { e.preventDefault(); cancel(); }
          }}
          rows={2}
          className={cn("w-full bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none resize-none", className)}
          placeholder={placeholder}
        />
      );
    }
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") { e.preventDefault(); cancel(); }
        }}
        className={cn("w-full bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
      title={title || "Double-click to rename"}
      className={cn("cursor-text hover:text-[hsl(var(--primary))] transition-colors", className)}
    >{value || placeholder || "—"}</span>
  );
}

function Skeleton({ className = "" }) {
  return <div className={cn("skeleton", className)} />;
}

/* ============================================================
   COLOR HELPERS + SHARED SWATCH PICKER
   The app stores colors as HSL triples ("263 70% 60%") so they can be
   dropped straight into `hsl(...)`. The custom picker uses a native
   <input type="color"> (hex), so we convert both ways to keep one format
   everywhere. Used by Habit / Goal / Rule / Event / Board pickers.
============================================================ */
function hexToHslTriple(hex) {
  let c = String(hex || "").replace("#", "").trim();
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  if (c.length !== 6 || /[^0-9a-f]/i.test(c)) return "263 70% 60%";
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2; const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslTripleToHex(triple) {
  const m = String(triple || "").match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!m) return "#8b5cf6";
  const h = +m[1], s = +m[2] / 100, l = +m[3] / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/* Inline swatch row with a calibrated palette + a native "Custom" tile.
   - `value` / `onChange` work in HSL-triple format.
   - A custom (off-palette) value is shown as a filled, selected tile that
     reopens the native picker when clicked.
   - `ring` chooses the active-ring color token ("foreground" | "primary"). */
function SwatchPicker({ value, onChange, palette, size = 32, ring = "foreground" }) {
  const colors = palette || (typeof HABIT_COLORS !== "undefined" ? HABIT_COLORS : ["263 70% 60%"]);
  const inPalette = colors.includes(value);
  const customActive = !inPalette && !!value;
  const dim = { width: size, height: size };
  const ringCls = ring === "primary"
    ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--card))] ring-[hsl(var(--primary))]"
    : "ring-2 ring-offset-2 ring-offset-[hsl(var(--card))] ring-[hsl(var(--foreground))]";
  const base = "rounded-[8px] flex items-center justify-center transition-all";
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {colors.map(c => {
        const active = value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-label={`Color ${c}`}
            style={{ ...dim, background: `hsl(${c})` }}
            className={cn(base, active ? ringCls : "hover:scale-110")}
          >
            {active && <Icons.Check size={Math.round(size * 0.42)} className="text-white" stroke={3} />}
          </button>
        );
      })}
      <label
        title="Custom color"
        style={dim}
        className={cn(
          base, "relative cursor-pointer overflow-hidden",
          customActive ? ringCls : "border border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:scale-110"
        )}
      >
        {customActive ? (
          <span className="absolute inset-0" style={{ background: `hsl(${value})` }} />
        ) : (
          <span className="absolute inset-[3px] rounded-[5px]" style={{ background: "conic-gradient(from 0deg, #f43f5e, #f59e0b, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #f43f5e)", opacity: 0.9 }} />
        )}
        {customActive
          ? <Icons.Check size={Math.round(size * 0.42)} className="relative text-white" stroke={3} style={{ filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.5))" }} />
          : <Icons.Plus size={Math.round(size * 0.42)} className="relative text-white" stroke={3} style={{ filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.55))" }} />}
        <input
          type="color"
          value={hslTripleToHex(customActive ? value : "#8b5cf6")}
          onChange={(e) => onChange(hexToHslTriple(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Pick a custom color"
        />
      </label>
    </div>
  );
}

/* Striped image placeholder */
function ImgPlaceholder({ label, className = "", aspect = "16/9" }) {
  return (
    <div
      className={cn("striped rounded-[8px] flex items-center justify-center text-[11px] font-mono text-[hsl(var(--muted-foreground))]", className)}
      style={{ aspectRatio: aspect }}
    >
      <span className="bg-[hsl(var(--card))] px-2 py-0.5 rounded">[{label}]</span>
    </div>
  );
}

/* Expose everything */
Object.assign(window, {
  React, useState, useEffect, useRef, useMemo, useCallback, createContext, useContext,
  Icons, cn,
  Button, Card, SectionTitle, Badge, Input, Checkbox, Switch, Avatar, Logo,
  ProgressBar, Ring, ViewToggle, EmptyState, Skeleton, ImgPlaceholder, EditableTitle,
  SwatchPicker, hexToHslTriple, hslTripleToHex,
});
