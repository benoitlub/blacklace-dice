import React from 'react';
import { motion } from 'framer-motion';

const ORANGE = '#f97316';
const ORANGE_DIM = '#ea580c';
const ORANGE_GLOW = '#fb923c';

interface CyclopsEyeProps {
  size?: number;
  color?: string;
  glow?: boolean;
  pulse?: boolean;
  chaos?: boolean;
  opacity?: number;
}

export function CyclopsEye({
  size = 32,
  color = ORANGE,
  glow = true,
  pulse = false,
  chaos = false,
  opacity = 1,
}: CyclopsEyeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const ew = size * 0.38;
  const eh = size * 0.20;
  const irisR = size * 0.13;
  const pupilR = size * 0.065;
  const outerR = size * 0.44;
  const innerR = size * 0.28;
  const glowR = size * 0.18;

  const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 1.9} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.5} ${cx - ew},${cy} Z`;

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    const r1 = innerR + size * 0.03;
    const r2 = outerR - size * 0.02;
    return {
      x1: cx + Math.cos(angle) * r1,
      y1: cy + Math.sin(angle) * r1,
      x2: cx + Math.cos(angle) * r2,
      y2: cy + Math.sin(angle) * r2,
    };
  });

  const vinePoints = chaos ? Array.from({ length: 5 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const r = outerR * 1.1;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  }) : [];

  const eyeContent = (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {glow && (
        <defs>
          <radialGradient id={`cg-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id={`cf-${size}`}>
            <feGaussianBlur stdDeviation={size * 0.06} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}

      {/* outer sacred circle */}
      <circle cx={cx} cy={cy} r={outerR} stroke={color} strokeWidth={size * 0.025} opacity={0.25} />

      {/* inner circle */}
      <circle cx={cx} cy={cy} r={innerR} stroke={color} strokeWidth={size * 0.018} opacity={0.18} />

      {/* cardinal rays */}
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke={color} strokeWidth={size * 0.018} strokeLinecap="round" opacity={i % 2 === 0 ? 0.35 : 0.2} />
      ))}

      {/* chaos vine arcs */}
      {chaos && vinePoints.map((p, i) => {
        const next = vinePoints[(i + 1) % vinePoints.length];
        const midX = cx + (Math.cos(((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2) * outerR * 1.25);
        const midY = cy + (Math.sin(((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2) * outerR * 1.25);
        return (
          <path key={i} d={`M ${p.x},${p.y} Q ${midX},${midY} ${next.x},${next.y}`}
            stroke={color} strokeWidth={size * 0.018} strokeLinecap="round" fill="none" opacity={0.2} />
        );
      })}

      {/* glow halo */}
      {glow && <circle cx={cx} cy={cy} r={glowR} fill={`url(#cg-${size})`} />}

      {/* eye lid shape */}
      <path d={eyePath} fill={`${color}22`} stroke={color} strokeWidth={size * 0.03} strokeLinejoin="round" />

      {/* iris */}
      <circle cx={cx} cy={cy} r={irisR} fill={`${color}44`} stroke={color} strokeWidth={size * 0.025} />

      {/* iris inner ring */}
      <circle cx={cx} cy={cy} r={irisR * 0.6} stroke={color} strokeWidth={size * 0.018} opacity={0.5} fill="none" />

      {/* pupil */}
      <circle cx={cx} cy={cy} r={pupilR} fill={color} opacity={0.95} />

      {/* pupil glint */}
      <circle cx={cx - pupilR * 0.5} cy={cy - pupilR * 0.5} r={pupilR * 0.3} fill="white" opacity={0.7} />

      {/* upper eyelid highlight line */}
      <path d={`M ${cx - ew * 0.6},${cy - eh * 0.3} Q ${cx},${cy - eh * 1.6} ${cx + ew * 0.6},${cy - eh * 0.3}`}
        stroke="white" strokeWidth={size * 0.015} strokeLinecap="round" fill="none" opacity={0.15} />
    </svg>
  );

  if (pulse) {
    return (
      <motion.div
        animate={{ filter: [`drop-shadow(0 0 ${size * 0.1}px ${color}60)`, `drop-shadow(0 0 ${size * 0.22}px ${color}bb)`, `drop-shadow(0 0 ${size * 0.1}px ${color}60)`] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
        {eyeContent}
      </motion.div>
    );
  }

  return eyeContent;
}

/* ── Tiny 18px variant for mode card icons ─────────────────────────── */
export function CyclopsModeBadge({ color, size = 18 }: { color: string; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const ew = size * 0.37;
  const eh = size * 0.19;
  const irisR = size * 0.12;
  const pupilR = size * 0.06;
  const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 1.85} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.4} ${cx - ew},${cy} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={size * 0.43} stroke={color} strokeWidth={0.8} opacity={0.3} />
      <path d={eyePath} fill={`${color}25`} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={irisR} fill={`${color}40`} stroke={color} strokeWidth={0.9} />
      <circle cx={cx} cy={cy} r={pupilR} fill={color} opacity={0.95} />
      <circle cx={cx - pupilR * 0.5} cy={cy - pupilR * 0.5} r={pupilR * 0.35} fill="white" opacity={0.6} />
    </svg>
  );
}

/* ── Header die logo replacement ───────────────────────────────────── */
export function CyclopsHeaderIcon({ status = 'normal' }: { status?: 'normal' | 'premium' | 'test' }) {
  // Color reflects subscription status:
  //  • normal  → orange (default feuch tone)
  //  • premium → gold (paid / unlocked)
  //  • test    → green (developer / test mode)
  const COLOR =
    status === 'premium' ? '#fbbf24' :
    status === 'test'    ? '#22c55e' :
    ORANGE;
  const GLOW_DIM = `${COLOR}50`;
  const GLOW_BRIGHT = `${COLOR}cc`;
  return (
    <motion.div
      key={status}
      animate={{ filter: [`drop-shadow(0 0 3px ${GLOW_DIM})`, `drop-shadow(0 0 8px ${GLOW_BRIGHT})`, `drop-shadow(0 0 3px ${GLOW_DIM})`] }}
      transition={{ duration: status === 'normal' ? 3.5 : 2.2, repeat: Infinity, ease: 'easeInOut' }}>
      <CyclopsEye size={22} glow pulse={false} color={COLOR} opacity={0.9} />
    </motion.div>
  );
}

/* ── Large random-mode Dionysus cyclops ────────────────────────────── */
export function DionysusEye({ size = 52 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <motion.div
      animate={{ filter: ['drop-shadow(0 0 5px #f9731640)', 'drop-shadow(0 0 14px #f97316bb)', 'drop-shadow(0 0 5px #f9731640)'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <defs>
          <radialGradient id="dion-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.28" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer orbit circle */}
        <circle cx={cx} cy={cy} r={size * 0.46} stroke={ORANGE} strokeWidth={0.8} opacity={0.3} strokeDasharray="3 4" />

        {/* Middle orbit */}
        <circle cx={cx} cy={cy} r={size * 0.34} stroke={ORANGE} strokeWidth={0.6} opacity={0.2} />

        {/* 12 cardinal points */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI * 2) / 12;
          const r1 = size * 0.36;
          const r2 = size * 0.44;
          const r3 = size * 0.47;
          const isMajor = i % 3 === 0;
          return (
            <g key={i}>
              <line
                x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
                x2={cx + Math.cos(a) * (isMajor ? r3 : r2)} y2={cy + Math.sin(a) * (isMajor ? r3 : r2)}
                stroke={ORANGE} strokeWidth={isMajor ? 1.4 : 0.8} strokeLinecap="round"
                opacity={isMajor ? 0.55 : 0.25} />
            </g>
          );
        })}

        {/* Chaos pentagram vines */}
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const a2 = ((i + 2) * Math.PI * 2) / 5 - Math.PI / 2;
          const rp = size * 0.3;
          return (
            <line key={i}
              x1={cx + Math.cos(a) * rp} y1={cy + Math.sin(a) * rp}
              x2={cx + Math.cos(a2) * rp} y2={cy + Math.sin(a2) * rp}
              stroke={ORANGE} strokeWidth={0.7} opacity={0.18} strokeLinecap="round" />
          );
        })}

        {/* Triangle (Dionysian delta — upward) */}
        <polygon
          points={`${cx},${cy - size * 0.22} ${cx - size * 0.19},${cy + size * 0.13} ${cx + size * 0.19},${cy + size * 0.13}`}
          stroke={ORANGE} strokeWidth={0.9} fill="none" opacity={0.22} />

        {/* Inner glow */}
        <circle cx={cx} cy={cy} r={size * 0.2} fill="url(#dion-glow)" />

        {/* Eye lid */}
        {(() => {
          const ew = size * 0.28;
          const eh = size * 0.16;
          const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 2} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.6} ${cx - ew},${cy} Z`;
          const irisR = size * 0.095;
          const pupilR = size * 0.048;
          return (
            <>
              <path d={eyePath} fill={`${ORANGE}20`} stroke={ORANGE} strokeWidth={1.5} strokeLinejoin="round" />
              <circle cx={cx} cy={cy} r={irisR} fill={`${ORANGE}35`} stroke={ORANGE} strokeWidth={1.2} />
              <circle cx={cx} cy={cy} r={irisR * 0.55} stroke={ORANGE} strokeWidth={0.8} opacity={0.4} fill="none" />
              <circle cx={cx} cy={cy} r={pupilR} fill={ORANGE} opacity={0.95} />
              <circle cx={cx - pupilR * 0.5} cy={cy - pupilR * 0.5} r={pupilR * 0.35} fill="white" opacity={0.75} />
              {/* Lash marks */}
              {[-1, 0, 1].map(offset => {
                const lx = cx + offset * ew * 0.35;
                const startY = cy - eh * (1.5 - Math.abs(offset) * 0.4);
                return (
                  <line key={offset} x1={lx} y1={startY} x2={lx} y2={startY - size * 0.06}
                    stroke={ORANGE} strokeWidth={0.9} strokeLinecap="round" opacity={0.45} />
                );
              })}
            </>
          );
        })()}
      </svg>
    </motion.div>
  );
}

/* ── Mode SVG icons (feuchienne iconography) ────────────────────────── */

/** ACTION — bullseye target with sacred geometry, purple */
export function ActionTargetIcon({ size = 48, color = '#a855f7' }: { size?: number; color?: string }) {
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id="act-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={size * 0.44} fill={`${color}08`} stroke={color} strokeWidth={0.7} opacity={0.4} />
      <circle cx={cx} cy={cy} r={size * 0.33} fill={`${color}10`} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <circle cx={cx} cy={cy} r={size * 0.21} fill={`${color}18`} stroke={color} strokeWidth={1.2} opacity={0.7} />
      <circle cx={cx} cy={cy} r={size * 0.22} fill="url(#act-glow)" />
      {/* Cardinal cross hairs */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <line key={i}
          x1={cx + Math.cos(a) * size * 0.23} y1={cy + Math.sin(a) * size * 0.23}
          x2={cx + Math.cos(a) * size * 0.42} y2={cy + Math.sin(a) * size * 0.42}
          stroke={color} strokeWidth={0.9} strokeLinecap="round" opacity={0.55} />
      ))}
      {/* Diagonal ticks */}
      {[Math.PI / 4, Math.PI * 3 / 4, Math.PI * 5 / 4, Math.PI * 7 / 4].map((a, i) => (
        <line key={i}
          x1={cx + Math.cos(a) * size * 0.31} y1={cy + Math.sin(a) * size * 0.31}
          x2={cx + Math.cos(a) * size * 0.4} y2={cy + Math.sin(a) * size * 0.4}
          stroke={color} strokeWidth={0.7} strokeLinecap="round" opacity={0.3} />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.08} fill={color} opacity={0.9} />
      <circle cx={cx - size * 0.025} cy={cy - size * 0.025} r={size * 0.025} fill="white" opacity={0.55} />
    </svg>
  );
}

/** FEUCH — chaos hexagon with cyclops eye, orange */
export function FeuchHexIcon({ size = 48, color = '#f97316' }: { size?: number; color?: string }) {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.44;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
  }).join(' ');
  const ew = size * 0.17, eh = size * 0.1;
  const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 2.2} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.6} ${cx - ew},${cy} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id="fh-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Hexagon */}
      <polygon points={hex} fill={`${color}08`} stroke={color} strokeWidth={1.2} strokeLinejoin="round" opacity={0.7} />
      {/* Inner hex smaller */}
      {(() => {
        const r2 = R * 0.6;
        const h2 = Array.from({ length: 6 }, (_, i) => {
          const a = (i * Math.PI) / 3 - Math.PI / 6;
          return `${cx + r2 * Math.cos(a)},${cy + r2 * Math.sin(a)}`;
        }).join(' ');
        return <polygon points={h2} fill="none" stroke={color} strokeWidth={0.6} opacity={0.3} />;
      })()}
      {/* Spoke lines hex to center */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        return (
          <line key={i}
            x1={cx + R * 0.22 * Math.cos(a)} y1={cy + R * 0.22 * Math.sin(a)}
            x2={cx + R * 0.55 * Math.cos(a)} y2={cy + R * 0.55 * Math.sin(a)}
            stroke={color} strokeWidth={0.6} opacity={0.22} />
        );
      })}
      <circle cx={cx} cy={cy} r={size * 0.18} fill="url(#fh-glow)" />
      {/* Eye */}
      <path d={eyePath} fill={`${color}28`} stroke={color} strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={size * 0.06} fill={`${color}55`} stroke={color} strokeWidth={0.9} />
      <circle cx={cx} cy={cy} r={size * 0.032} fill={color} opacity={0.95} />
      <circle cx={cx - size * 0.012} cy={cy - size * 0.012} r={size * 0.01} fill="white" opacity={0.65} />
    </svg>
  );
}

/** BELETTE — weasel sacred eye with leaf frame, blue */
export function BeletteEyeIcon({ size = 48, color = '#3b82f6' }: { size?: number; color?: string }) {
  const cx = size / 2, cy = size / 2;
  const ew = size * 0.38, eh = size * 0.19;
  const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 2.1} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.55} ${cx - ew},${cy} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id="be-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer diamond ◈ shape */}
      <path d={`M ${cx},${cy - size * 0.44} L ${cx + size * 0.44},${cy} L ${cx},${cy + size * 0.44} L ${cx - size * 0.44},${cy} Z`}
        fill={`${color}08`} stroke={color} strokeWidth={0.8} opacity={0.4} />
      {/* Inner diamond */}
      <path d={`M ${cx},${cy - size * 0.28} L ${cx + size * 0.28},${cy} L ${cx},${cy + size * 0.28} L ${cx - size * 0.28},${cy} Z`}
        fill="none" stroke={color} strokeWidth={0.6} opacity={0.25} />
      <circle cx={cx} cy={cy} r={size * 0.19} fill="url(#be-glow)" />
      {/* Eye */}
      <path d={eyePath} fill={`${color}22`} stroke={color} strokeWidth={1.3} strokeLinejoin="round" />
      {/* Iris */}
      <circle cx={cx} cy={cy} r={size * 0.11} fill={`${color}35`} stroke={color} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={size * 0.065} stroke={color} strokeWidth={0.7} opacity={0.4} fill="none" />
      <circle cx={cx} cy={cy} r={size * 0.038} fill={color} opacity={0.92} />
      <circle cx={cx - size * 0.014} cy={cy - size * 0.014} r={size * 0.012} fill="white" opacity={0.7} />
      {/* Corner dots ◈ */}
      {[[cx, cy - size * 0.44], [cx + size * 0.44, cy], [cx, cy + size * 0.44], [cx - size * 0.44, cy]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={size * 0.022} fill={color} opacity={0.55} />
      ))}
    </svg>
  );
}

/** SOCIAL — radio signal waves with center node, pink */
export function SocialWaveIcon({ size = 48, color = '#ec4899' }: { size?: number; color?: string }) {
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id="sw-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Signal arcs — right side */}
      {[0.18, 0.28, 0.38].map((r, i) => (
        <path key={i}
          d={`M ${cx + size * r * Math.cos(Math.PI * 0.75)},${cy + size * r * Math.sin(Math.PI * 0.75)} A ${size * r},${size * r} 0 0 1 ${cx + size * r * Math.cos(Math.PI * 1.25)},${cy + size * r * Math.sin(Math.PI * 1.25)}`}
          stroke={color} strokeWidth={1.4 - i * 0.2} strokeLinecap="round" opacity={0.65 - i * 0.12} />
      ))}
      {/* Signal arcs — left side mirror */}
      {[0.18, 0.28, 0.38].map((r, i) => (
        <path key={i}
          d={`M ${cx - size * r * Math.cos(Math.PI * 0.75)},${cy + size * r * Math.sin(Math.PI * 0.75)} A ${size * r},${size * r} 0 0 0 ${cx - size * r * Math.cos(Math.PI * 1.25)},${cy + size * r * Math.sin(Math.PI * 1.25)}`}
          stroke={color} strokeWidth={1.4 - i * 0.2} strokeLinecap="round" opacity={0.65 - i * 0.12} />
      ))}
      {/* Vertical arcs top */}
      {[0.2, 0.33, 0.44].map((r, i) => (
        <path key={i}
          d={`M ${cx - size * r},${cy} A ${size * r},${size * r} 0 0 1 ${cx + size * r},${cy}`}
          stroke={color} strokeWidth={1.3 - i * 0.15} strokeLinecap="round" opacity={0.5 - i * 0.1} fill="none" />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.18} fill="url(#sw-glow)" />
      {/* Center node */}
      <circle cx={cx} cy={cy} r={size * 0.07} fill={`${color}35`} stroke={color} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={size * 0.038} fill={color} opacity={0.95} />
      <circle cx={cx - size * 0.014} cy={cy - size * 0.014} r={size * 0.012} fill="white" opacity={0.65} />
    </svg>
  );
}

/* ── Watermark background cyclops (200px, very faint) ──────────────── */
export function CyclopsWatermark({ size = 220 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const ew = size * 0.35;
  const eh = size * 0.18;
  const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 2} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.6} ${cx - ew},${cy} Z`;
  const rings = [0.46, 0.35, 0.25, 0.16];
  const rays12 = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ opacity: 0.04 }}>
      {rings.map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={size * r} stroke={ORANGE} strokeWidth={1.2} />
      ))}
      {rays12.map((a, i) => (
        <line key={i}
          x1={cx + Math.cos(a) * size * 0.18} y1={cy + Math.sin(a) * size * 0.18}
          x2={cx + Math.cos(a) * size * 0.44} y2={cy + Math.sin(a) * size * 0.44}
          stroke={ORANGE} strokeWidth={0.8} strokeLinecap="round" opacity={i % 3 === 0 ? 1 : 0.5} />
      ))}
      {/* Pentagram */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const a2 = ((i + 2) * Math.PI * 2) / 5 - Math.PI / 2;
        const rp = size * 0.3;
        return <line key={i} x1={cx + Math.cos(a) * rp} y1={cy + Math.sin(a) * rp} x2={cx + Math.cos(a2) * rp} y2={cy + Math.sin(a2) * rp} stroke={ORANGE} strokeWidth={1} />;
      })}
      <polygon points={`${cx},${cy - size * 0.2} ${cx - size * 0.17},${cy + size * 0.11} ${cx + size * 0.17},${cy + size * 0.11}`} stroke={ORANGE} strokeWidth={1} fill="none" />
      <path d={eyePath} stroke={ORANGE} strokeWidth={2} strokeLinejoin="round" fill="none" />
      <circle cx={cx} cy={cy} r={size * 0.085} stroke={ORANGE} strokeWidth={1.5} fill="none" />
      <circle cx={cx} cy={cy} r={size * 0.04} fill={ORANGE} />
    </svg>
  );
}
