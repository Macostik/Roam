import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/theme/colors';

import { Icon } from './icon';
import { IconButton } from './icon-button';

type TextFieldProps = Omit<TextInputProps, 'className'> & {
  icon: LucideIcon;
  // secure: the password field. Adds a show/hide toggle.
  secure?: boolean;
  // Forces the focused look, e.g. for design review. Real focus also applies it.
  state?: 'default' | 'focused';
};

export function TextField({
  icon,
  secure = false,
  state = 'default',
  placeholder,
  ...props
}: TextFieldProps) {
  const [inputFocused, setInputFocused] = useState(false);
  const focused = state === 'focused' || inputFocused;
  const [hidden, setHidden] = useState(secure);

  return (
    <View
      className={[
        'h-14 flex-row items-center gap-3 rounded-lg border-2 px-4',
        focused ? 'border-lavender bg-surface' : 'border-transparent bg-canvas',
      ].join(' ')}>
      <Icon icon={icon} />
      <TextInput
        className="flex-1 font-spline text-body text-ink"
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
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
      {secure && (
        <IconButton
          icon={hidden ? Eye : EyeOff}
          label={hidden ? 'Show password' : 'Hide password'}
          variant="plain"
          onPress={() => setHidden((value) => !value)}
        />
      )}
    </View>
  );
}
