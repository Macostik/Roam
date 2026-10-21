import { Heart, MapPin, Star, type LucideIcon } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Badge } from './badge';
import { Icon } from './icon';
import { IconButton } from './icon-button';
import { Text } from './text';

type ListingCardProps = {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  // Formatted by the caller, e.g. "$280".
  price: string;
  imageUri: string;
  amenities: { label: string; icon: LucideIcon }[];
  favorited?: boolean;
  onToggleFavorite?: () => void;
  onPress?: () => void;
};

export function ListingCard({
  title,
  location,
  rating,
  reviewCount,
  price,
  imageUri,
  amenities,
  favorited = false,
  onToggleFavorite,
  onPress,
}: ListingCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${price} per night`}
      onPress={onPress}
      className="flex-row gap-3 rounded-2xl bg-surface p-3 shadow-card active:opacity-70">
      <View className="h-40 w-36 overflow-hidden rounded-xl">
        {/* TODO(asset): the photo is a remote placeholder. Replace with the real property photo. */}
        <Image source={{ uri: imageUri }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
        <IconButton
          icon={Heart}
          label={favorited ? 'Remove from saved' : 'Save'}
          variant="surface"
          filled={favorited}
          onPress={onToggleFavorite}
          className="absolute right-2 top-2 h-9 w-9"
        />
      </View>

      <View className="flex-1 gap-1">
        <Text variant="title">{title}</Text>
        <View className="flex-row items-center gap-1">
          <Icon icon={MapPin} tone="muted" size={14} />
          <Text variant="caption" tone="muted">
            {location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon icon={Star} tone="primary" size={14} filled />
          <Text variant="caption">
            {rating.toFixed(1)} ({reviewCount})
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-1">
          {amenities.map((amenity) => (
            <Badge key={amenity.label} variant="amenity" label={amenity.label} icon={amenity.icon} />
          ))}
        </View>
        <View className="flex-row items-baseline gap-1">
          <Text variant="title">{price}</Text>
          <Text variant="caption" tone="muted">
            / night
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
