import { Pressable, View } from 'react-native';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
};

export function Toggle({ value, onValueChange, label, disabled = false }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      className={[
        'h-8 w-13 flex-row items-center rounded-full p-0.5 disabled:opacity-40',
        value ? 'justify-end bg-primary' : 'justify-start bg-track-off',
      ].join(' ')}>
      <View className="h-7 w-7 rounded-full bg-surface shadow-card" />
    </Pressable>
  );
}
