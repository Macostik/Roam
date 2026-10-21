import { Image } from 'expo-image';
import { MapPin } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { colors } from '@/theme/colors';

import { OnboardingSheet } from './onboarding-sheet';
import type { OnboardingSlide } from './onboarding-slides';

type OnboardingPageProps = {
  slide: OnboardingSlide;
  index: number;
  count: number;
  width: number;
  onGetStarted: () => void;
  onGoogle: () => void;
};

// One full-screen slide. Each page carries its own photo, wordmark, pill, and sheet, so a
// swipe moves them together. Skip lives above the list (see onboarding.tsx).
// TEMPORARY (approved): style props, see onboarding-sheet.tsx.
export function OnboardingPage({
  slide,
  index,
  count,
  width,
  onGetStarted,
  onGoogle,
}: OnboardingPageProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ width, flex: 1, backgroundColor: colors.ink }}>
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
        <Image
          source={slide.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View style={{ position: 'absolute', top: insets.top + 8, left: 24 }}>
        <Text style={{ fontFamily: 'SplineSans_700Bold', fontSize: 56, lineHeight: 56, color: colors.ink }}>
          roam
        </Text>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <View
            style={{
              alignSelf: 'flex-start',
              height: 36,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              borderRadius: 9999,
              backgroundColor: colors['ink-scrim'],
            }}>
            <Icon icon={MapPin} tone="surface" size={16} />
            <Text style={{ fontFamily: 'SplineSans_500Medium', fontSize: 14, lineHeight: 20, color: colors.surface }}>
              {slide.location}
            </Text>
          </View>
        </View>
        <OnboardingSheet
          slide={slide}
          index={index}
          count={count}
          onGetStarted={onGetStarted}
          onGoogle={onGoogle}
        />
      </View>
    </View>
  );
}
