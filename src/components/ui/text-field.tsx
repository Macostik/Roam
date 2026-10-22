import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';

import { Icon } from './icon';
import { IconButton } from './icon-button';
import { Text } from './text';

type TextFieldProps = Omit<TextInputProps, 'className'> & {
  icon: LucideIcon;
  // label: shown above the input. The placeholder then reads as an example value.
  label?: string;
  // error: shown under the field. Turns the border red.
  error?: string;
  // secure: the password field. Adds a show/hide toggle.
  secure?: boolean;
  // Forces the focused look, e.g. for design review. Real focus also applies it.
  state?: 'default' | 'focused';
};

export function TextField({
  icon,
  label,
  error,
  secure = false,
  state = 'default',
  placeholder,
  ...props
}: TextFieldProps) {
  const [inputFocused, setInputFocused] = useState(false);
  const focused = state === 'focused' || inputFocused;
  const [hidden, setHidden] = useState(secure);

  return (
    <View className="gap-2">
      <View
        className={[
          'h-14 flex-row items-center gap-3 rounded-lg border-2 px-4',
          error ? 'border-danger bg-canvas' : focused ? 'border-lavender bg-surface' : 'border-transparent bg-canvas',
        ].join(' ')}>
        <Icon icon={icon} />
        <View className="flex-1 justify-center">
          {label ? <Text variant="label">{label}</Text> : null}
          <TextInput
            className="font-spline text-body text-ink"
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            accessibilityLabel={label ?? placeholder}
            secureTextEntry={secure && hidden}
            {...props}
            onFocus={(event) => {
              setInputFocused(true);
              props.onFocus?.(event);
            }}
            onBlur={(event) => {
              setInputFocused(false);
              props.onBlur?.(event);
            }}
          />
        </View>
        {secure && (
          <IconButton
            // The crossed eye shows while the password is hidden, as in the sign-up design.
            icon={hidden ? EyeOff : Eye}
            label={hidden ? 'Show password' : 'Hide password'}
            variant="plain"
            onPress={() => setHidden((value) => !value)}
          />
        )}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" className="px-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
