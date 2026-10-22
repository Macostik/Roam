import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingPage } from '@/components/onboarding/onboarding-page';
import { onboardingSlides, type OnboardingSlide } from '@/components/onboarding/onboarding-slides';
import { colors } from '@/theme/colors';

// TEMPORARY (approved): style props instead of className. See onboarding-sheet.tsx.
export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === onboardingSlides.length - 1;

  // Until Clerk exists, every path out of onboarding leads to the mock sign-up (plan 06).
  const toSignUp = () => router.push('/sign-up');

  const goTo = (next: number) => {
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setIndex(next);
  };

  const getStarted = () => (isLast ? toSignUp() : goTo(index + 1));

  // The swipe settles on a page; keep the index in step with what the user sees.
  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <FlatList
        ref={listRef}
        data={onboardingSlides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item, index: i }) => (
          <OnboardingPage
            slide={item}
            index={i}
            count={onboardingSlides.length}
            width={width}
            onGetStarted={getStarted}
            onGoogle={toSignUp}
          />
        )}
      />

      {/* Fixed above the list, so it stays put while the slides swipe under it. */}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 24,
          right: 24,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={toSignUp}
          style={({ pressed }) => ({
            height: 36,
            justifyContent: 'center',
            paddingHorizontal: 16,
            borderRadius: 9999,
            backgroundColor: colors.glass,
            opacity: pressed ? 0.7 : 1,
          })}>
          <Text style={{ fontFamily: 'SplineSans_500Medium', fontSize: 17, lineHeight: 22, color: colors.ink }}>
            Skip
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
