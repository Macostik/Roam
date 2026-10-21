import type { ImageSourcePropType } from 'react-native';

export type OnboardingSlide = {
  location: string;
  // Explicit \n matches the design's line breaks at phone width.
  headline: string;
  body: string;
  image: ImageSourcePropType;
};

// Photos from Unsplash, bundled in assets/onboarding/ (Unsplash License).
export const onboardingSlides: OnboardingSlide[] = [
  {
    location: 'Whistler, BC',
    headline: 'Find a stay that fits\nyour story',
    body: 'From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.',
    image: require('../../../assets/onboarding/lake-cabin.jpg'),
  },
  {
    location: 'Aqaba, Jordan',
    headline: "Just say what\nyou're after",
    body: "Describe your trip in one sentence, like a quiet cabin with a hot tub, and roam ranks the stays that fit.",
    image: require('../../../assets/onboarding/palm-beach.jpg'),
  },
  {
    location: 'Skykomish, WA',
    headline: 'Answers straight\nfrom the stay',
    body: "Ask about check-in, pets or cancellations and see the stay's own rules, word for word, with their source.",
    image: require('../../../assets/onboarding/a-frame.jpg'),
  },
];
