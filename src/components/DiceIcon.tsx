import React from 'react';
import { CyclopsHeaderIcon } from './CyclopsEye';

interface DiceIconProps {
  className?: string;
  status?: 'normal' | 'premium' | 'test';
}

export function DiceIcon({ status = 'normal' }: DiceIconProps) {
  return <CyclopsHeaderIcon status={status} />;
}
