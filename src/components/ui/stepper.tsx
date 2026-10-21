import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

import { IconButton } from './icon-button';
import { Text } from './text';

type StepperProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
};

export function Stepper({ value, onValueChange, min = 0, max = 99, label }: StepperProps) {
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value }}
      className="h-14 flex-row items-center gap-2 rounded-full border border-border bg-surface p-1">
      <IconButton
        icon={Minus}
        label={`Decrease ${label}`}
        disabled={value <= min}
        onPress={() => onValueChange(Math.max(min, value - 1))}
      />
      <Text variant="title" className="w-8 text-center">
        {value}
      </Text>
      <IconButton
        icon={Plus}
        label={`Increase ${label}`}
        disabled={value >= max}
        onPress={() => onValueChange(Math.min(max, value + 1))}
      />
    </View>
  );
}
