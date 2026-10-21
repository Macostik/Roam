import type { LucideIcon } from 'lucide-react-native';

import { colors } from '@/theme/colors';

export type IconTone = 'ink' | 'muted' | 'primary' | 'surface' | 'danger' | 'success' | 'info';

export function Icon({
  icon: Glyph,
  tone = 'ink',
  size = 20,
  strokeWidth = 2,
  filled = false,
}: {
  icon: LucideIcon;
  tone?: IconTone;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
}) {
  const color = colors[tone];
  return <Glyph size={size} color={color} fill={filled ? color : 'none'} strokeWidth={strokeWidth} />;
}
