import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ORANGE = '#f97316';

const FACE_DOTS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

function EyeDot({ dotColor, dotSize }: { dotColor: string; dotSize: number }) {
  const cx = dotSize / 2;
  const cy = dotSize / 2;
  const ew = dotSize * 0.45;
  const eh = dotSize * 0.22;
  const eyePath = `M ${cx - ew},${cy} Q ${cx},${cy - eh * 1.8} ${cx + ew},${cy} Q ${cx},${cy + eh * 1.4} ${cx - ew},${cy} Z`;
  return (
    <svg width={dotSize} height={dotSize} viewBox={`0 0 ${dotSize} ${dotSize}`} fill="none" style={{ overflow: 'visible' }}>
      <path d={eyePath} fill={`${dotColor}30`} stroke={dotColor} strokeWidth={dotSize * 0.08} />
      <circle cx={cx} cy={cy} r={dotSize * 0.18} fill={dotColor} opacity={0.95}
        style={{ filter: `drop-shadow(0 0 ${dotSize * 0.2}px ${dotColor})` }} />
    </svg>
  );
}

function RegularDot({ dotColor, dotSize }: { dotColor: string; dotSize: number }) {
  return (
    <div style={{
      width: dotSize, height: dotSize,
      borderRadius: '50%',
      backgroundColor: dotColor,
      boxShadow: `0 0 8px ${dotColor}cc`,
    }} />
  );
}

function DieFace({ face, color, size = 'md' }: { face: number; color?: string; size?: 'sm' | 'md' }) {
  const dotColor = color || ORANGE;
  const dim = size === 'sm' ? 44 : 80;
  const radius = size === 'sm' ? 10 : 16;
  const pad = size === 'sm' ? 6 : 10;
  const dotSize = size === 'sm' ? 6 : 10;
  const isCyclops = face === 1;

  return (
    <div
      style={{
        width: dim, height: dim,
        borderRadius: radius,
        border: `2px solid ${dotColor}40`,
        background: isCyclops
          ? `radial-gradient(circle at 50% 50%, ${dotColor}15, rgba(15,15,25,0.95))`
          : 'rgba(15,15,25,0.92)',
        boxShadow: `0 0 30px ${dotColor}${isCyclops ? '50' : '25'}, inset 0 1px 1px ${dotColor}20`,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        padding: pad,
        gap: 0,
        position: 'relative',
      }}
    >
      {Array.from({ length: 9 }).map((_, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const hasDot = (FACE_DOTS[face] || []).some(([r, c]) => r === row && c === col);
        const isCenterDot = row === 1 && col === 1 && face === 1;
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasDot && (
              isCyclops && isCenterDot
                ? <EyeDot dotColor={dotColor} dotSize={dotSize * 2.2} />
                : <RegularDot dotColor={dotColor} dotSize={dotSize} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface RollingDiceProps {
  color?: string;
  size?: 'sm' | 'md';
}

export function RollingDice({ color = ORANGE, size = 'md' }: RollingDiceProps) {
  const [face, setFace] = useState(1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const intervals = [80, 80, 90, 100, 120, 140, 160];
    let i = 0;
    function nextTick() {
      setFace(Math.floor(Math.random() * 6) + 1);
      setTick(t => t + 1);
      i++;
      if (i < intervals.length) setTimeout(nextTick, intervals[i]);
    }
    const id = setTimeout(nextTick, intervals[0]);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div key={tick}
      initial={{ rotateY: -90, scale: 0.85 }}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ duration: 0.08, ease: 'easeOut' }}
      style={{ perspective: 400 }}>
      <DieFace face={face} color={color} size={size} />
    </motion.div>
  );
}
