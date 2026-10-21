import { Building2, Bath, PawPrint, House, Trees, Umbrella, Waves } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { ListingCard } from '@/components/ui/listing-card';
import { SearchField } from '@/components/ui/search-field';
import { Wordmark } from '@/components/ui/placeholders';

// Sample data. Replace with the real stay list when search is built.
const sampleStay = {
  title: 'Modern Cabin with Hot Tub',
  location: 'Lake Arrowhead, CA',
  rating: 4.9,
  reviewCount: 342,
  price: '$280',
  imageUri: 'https://picsum.photos/seed/roam-cabin/600/600',
};

const categories = [
  { label: 'All Stays', icon: House },
  { label: 'Cabins', icon: Trees },
  { label: 'Beach', icon: Waves },
  { label: 'City', icon: Building2 },
  { label: 'Villas', icon: Umbrella },
] as const;

export default function HomeScreen() {
  const [filters, setFilters] = useState<string[]>(['Cabins']);
  const [category, setCategory] = useState<string>('All Stays');

  const toggleFilter = (label: string) =>
    setFilters((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-canvas">
        <View className="gap-4 px-4 pb-24 pt-2">
          <Wordmark />

          <SearchField placeholder="Cabins in California" />

          <View className="flex-row flex-wrap gap-2">
            {['Cabins', 'Under $300', 'Pet Friendly', 'Quiet'].map((label) => (
              <Chip
                key={label}
                label={label}
                selected={filters.includes(label)}
                onPress={() => toggleFilter(label)}
              />
            ))}
          </View>

          <View className="flex-row flex-wrap gap-2">
            {categories.map((item) => {
              const selected = category === item.label;
              return (
                <Chip
                  key={item.label}
                  label={item.label}
                  variant="category"
                  selected={selected}
                  onPress={() => setCategory(item.label)}
                  icon={<Icon icon={item.icon} size={16} />}
                />
              );
            })}
          </View>

          <ListingCard
            {...sampleStay}
            amenities={[
              { label: 'Hot Tub', icon: Bath },
              { label: 'Pet Friendly', icon: PawPrint },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
