import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
}

export function ClockIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="6" x2="12" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function AlarmIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="5" y1="3" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="19" y1="3" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function TimerIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="9" stroke={color} strokeWidth="1.5" />
      <Line x1="12" y1="9" x2="12" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="10" y1="2" x2="14" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="12" y1="2" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}
