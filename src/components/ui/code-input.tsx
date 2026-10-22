import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Text } from './text';

type CodeInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
};

// One hidden TextInput does the typing, and the boxes only show its digits. This keeps iOS
// one-time-code autofill working, which per-box inputs would break.
export function CodeInput({ value, onChangeText, length = 6 }: CodeInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.slice(0, length).split('');
  const activeIndex = Math.min(digits.length, length - 1);

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      <View className="flex-row gap-2">
        {Array.from({ length }, (_, index) => {
          const active = index === activeIndex;
          return (
            <View
              key={index}
              className={[
                'h-14 flex-1 items-center justify-center rounded-lg border-2',
                active ? 'border-lavender bg-surface' : 'border-transparent bg-canvas',
              ].join(' ')}>
              <Text variant="title">{digits[index] ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        autoFocus
        accessibilityLabel={`${length}-digit code`}
        className="absolute h-px w-px opacity-0"
      />
    </Pressable>
  );
}
