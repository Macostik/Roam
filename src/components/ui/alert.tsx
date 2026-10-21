import { Check, CircleAlert, X } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from './icon';
import { IconButton } from './icon-button';
import { Text } from './text';

type AlertProps = {
  variant: 'success' | 'error';
  message: string;
  onDismiss?: () => void;
};

export function Alert({ variant, message, onDismiss }: AlertProps) {
  const isSuccess = variant === 'success';
  const tone = isSuccess ? 'success' : 'danger';

  return (
    <View
      accessibilityRole="alert"
      className={[
        'flex-row items-center gap-3 rounded-lg px-4 py-3',
        isSuccess ? 'bg-success-soft' : 'bg-danger-soft',
      ].join(' ')}>
      <Icon icon={isSuccess ? Check : CircleAlert} tone={tone} />
      <Text variant="body" tone={tone} className="flex-1">
        {message}
      </Text>
      {onDismiss && (
        <IconButton icon={X} label="Dismiss" variant="plain" iconTone={tone} onPress={onDismiss} />
      )}
    </View>
  );
}
