import { ArrowRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors } from '@/theme/colors';

import type { OnboardingSlide } from './onboarding-slides';

type OnboardingSheetProps = {
  slide: OnboardingSlide;
  index: number;
  count: number;
  onGetStarted: () => void;
  onGoogle: () => void;
};

// TEMPORARY (approved): style props instead of className, because NativeWind className
// does not resolve in this build. Revert to the shared components once that is fixed.
// Top-left radius 24, top-right radius 96 (estimated from the design; check on device).
export function OnboardingSheet({
  slide,
  index,
  count,
  onGetStarted,
  onGoogle,
}: OnboardingSheetProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 96,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
      }}>
      <View accessible accessibilityLabel={`Step ${index + 1} of ${count}`} style={{ flexDirection: 'row', gap: 8 }}>
        {Array.from({ length: count }, (_, step) => (
          <View
            key={step}
            style={{
              width: 32,
              height: 4,
              borderRadius: 9999,
              backgroundColor: step === index ? colors.lavender : colors.border,
            }}
          />
        ))}
      </View>

      <Text
        style={{
          marginTop: 20,
          fontFamily: 'SplineSans_700Bold',
          fontSize: 32,
          lineHeight: 36,
          color: colors.ink,
        }}>
        {slide.headline}
      </Text>

      <Text
        style={{
          marginTop: 16,
          fontFamily: 'SplineSans_400Regular',
          fontSize: 16,
          lineHeight: 24,
          color: colors.muted,
        }}>
        {slide.body}
      </Text>

      <View style={{ marginTop: 16, gap: 12 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started"
          onPress={onGetStarted}
          style={({ pressed }) => ({
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 9999,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.7 : 1,
          })}>
          <Text style={{ fontFamily: 'SplineSans_500Medium', fontSize: 17, lineHeight: 22, color: colors.ink }}>
            Get started
          </Text>
          <Icon icon={ArrowRight} size={20} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
          onPress={onGoogle}
          style={({ pressed }) => ({
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.7 : 1,
          })}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontFamily: 'SplineSans_500Medium', fontSize: 14, lineHeight: 20, color: colors.ink }}>
              G
            </Text>
          </View>
          <Text style={{ fontFamily: 'SplineSans_500Medium', fontSize: 17, lineHeight: 22, color: colors.ink }}>
            Continue with Google
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
