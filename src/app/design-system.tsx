import {
  ArrowRight,
  Bath,
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Heart,
  House,
  List,
  Lock,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  PawPrint,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Star,
  Trees,
  Umbrella,
  User,
  Waves,
} from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { ListingCard } from '@/components/ui/listing-card';
import { ListRow } from '@/components/ui/list-row';
import { PolicyCard } from '@/components/ui/policy-card';
import { GoogleMark, Wordmark } from '@/components/ui/placeholders';
import { SearchField } from '@/components/ui/search-field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Stepper } from '@/components/ui/stepper';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';

// Dev-only design review. Not linked from the tabs. Open with roam://design-system.
// Sections follow the design board (01-15). Board copy is used verbatim.

const swatches = [
  { name: 'Primary Yellow', hex: '#FFC629', className: 'bg-primary', use: 'Primary actions, active states' },
  { name: 'Lavender', hex: '#C9B4FF', className: 'bg-lavender', use: 'Secondary actions, highlights' },
  { name: 'Text Primary', hex: '#0B0B1A', className: 'bg-ink', use: 'Headings, primary text' },
  { name: 'Text Secondary', hex: '#6B7280', className: 'bg-muted', use: 'Body text, secondary text' },
  { name: 'Surface White', hex: '#FFFFFF', className: 'bg-surface border border-border', use: 'Cards, sheets, modals' },
  { name: 'Surface Gray', hex: '#F4F5F7', className: 'bg-canvas', use: 'App background, input fields' },
  { name: 'Border Gray', hex: '#E5E7EB', className: 'bg-border', use: 'Dividers, borders' },
  { name: 'Glass Blur', hex: 'rgba(255,255,255,0.7)', className: 'bg-glass border border-border', use: 'Tab bar, glass surfaces' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-2xl bg-surface p-4 shadow-card">
      <Text variant="title">{title}</Text>
      {children}
    </View>
  );
}

function Spec({ children }: { children: ReactNode }) {
  return (
    <Text variant="caption" tone="muted">
      {children}
    </Text>
  );
}

export default function DesignSystemScreen() {
  const [category, setCategory] = useState('All Stays');
  const [filter, setFilter] = useState('Cabins');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [toggleOn, setToggleOn] = useState(true);
  const [guests, setGuests] = useState(1);
  const [alertVisible, setAlertVisible] = useState(true);
  const [errorVisible, setErrorVisible] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-canvas">
        <View className="gap-4 p-4 pb-12">
          <Section title="01. Brand">
            <Wordmark />
            <Text variant="body" tone="muted">
              Find unforgettable stays for every kind of trip.
            </Text>
          </Section>

          <Section title="02. Color palette">
            {swatches.map((swatch) => (
              <View key={swatch.name} className="flex-row items-center gap-3">
                <View className={`h-12 w-12 rounded-lg ${swatch.className}`} />
                <View className="flex-1">
                  <Text variant="button">{swatch.name}</Text>
                  <Spec>
                    {swatch.hex} · {swatch.use}
                  </Spec>
                </View>
              </View>
            ))}
          </Section>

          <Section title="03. Typography">
            <View className="gap-1">
              <Text variant="display">Find your next stay</Text>
              <Spec>Display · Spline Sans Bold · 56 · line height 56 (board range 56–64)</Spec>
            </View>
            <View className="gap-1">
              <Text variant="heading">Modern Cabin with Hot Tub</Text>
              <Spec>Heading · Spline Sans Bold · 28 · line height 34 (board range 28–32)</Spec>
            </View>
            <View className="gap-1">
              <Text variant="title">Modern Cabin with Hot Tub</Text>
              <Spec>Title · Spline Sans Bold · 20 · line height 26 (est., used on cards)</Spec>
            </View>
            <View className="gap-1">
              <Text variant="body">
                From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.
              </Text>
              <Spec>Body · Spline Sans Regular · 16 · line height 24</Spec>
            </View>
            <View className="gap-1">
              <Text variant="caption" tone="muted">
                Lake Arrowhead, CA
              </Text>
              <Spec>Caption · Spline Sans Medium · 14 · line height 20</Spec>
            </View>
            <View className="gap-1">
              <Button title="Book this stay" className="self-start" />
              <Spec>Button · Spline Sans Medium · 17 · line height 22 (board range 17–18)</Spec>
            </View>
          </Section>

          <Section title="04. Buttons">
            <Button title="Book this stay" trailing={<Icon icon={ArrowRight} />} />
            <Button
              title="Continue with Google"
              variant="secondary"
              leading={<GoogleMark />}
            />
            <View className="flex-row gap-3">
              <IconButton icon={Heart} label="Save" variant="surface" />
              <IconButton icon={Share2} label="Share" variant="surface" />
              <IconButton icon={Search} label="Search" variant="surface" />
              <IconButton icon={Bookmark} label="Bookmark" variant="surface" />
            </View>
          </Section>

          <Section title="05. Input fields">
            <SearchField placeholder="Cabins in California" />
            <TextField icon={User} placeholder="Enter your name" />
            <TextField icon={User} state="focused" value="Joanna Smith" />
            <TextField icon={Lock} secure placeholder="Password" value="password123" />
          </Section>

          <Section title="06. Filter chips">
            <View className="flex-row flex-wrap gap-2">
              {['Cabins', 'Under $300', 'Pet Friendly', 'Quiet'].map((label) => (
                <Chip key={label} label={label} selected={filter === label} onPress={() => setFilter(label)} />
              ))}
            </View>
            <View className="flex-row flex-wrap gap-2">
              {[
                { label: 'All Stays', icon: House },
                { label: 'Cabins', icon: Trees },
                { label: 'Beach', icon: Waves },
                { label: 'City', icon: Building2 },
                { label: 'Villas', icon: Umbrella },
              ].map((item) => (
                <Chip
                  key={item.label}
                  label={item.label}
                  variant="category"
                  selected={category === item.label}
                  onPress={() => setCategory(item.label)}
                  icon={<Icon icon={item.icon} size={16} />}
                />
              ))}
            </View>
          </Section>

          <Section title="07. Listing card">
            <ListingCard
              title="Modern Cabin with Hot Tub"
              location="Lake Arrowhead, CA"
              rating={4.9}
              reviewCount={342}
              price="$280"
              imageUri="https://picsum.photos/seed/roam-cabin/600/600"
              amenities={[
                { label: 'Hot Tub', icon: Bath },
                { label: 'Pet Friendly', icon: PawPrint },
              ]}
            />
          </Section>

          <Section title="08. Policy card">
            <PolicyCard
              icon={MessageSquare}
              title="Ask about policies"
              description="Cancellation, house rules, pets, check-in and more."
            />
            <PolicyCard
              icon={FileText}
              title="Free cancellation"
              description="Full refund up to 7 days before check-in."
            />
          </Section>

          <Section title="09. Profile row">
            <View className="rounded-2xl border border-border">
              <ListRow icon={User} label="Personal info" />
              <View className="ml-4 h-px bg-border" />
              <ListRow icon={CreditCard} label="Payment methods" />
              <View className="ml-4 h-px bg-border" />
              <ListRow icon={Briefcase} label="Trips" />
            </View>
          </Section>

          <Section title="10. Bottom navigation">
            <Spec>
              Rendered by the native tab bar in src/components/app-tabs.tsx (Home, Search, Trips,
              Profile). It is not repeated here.
            </Spec>
          </Section>

          <Section title="11. Iconography">
            <View className="flex-row flex-wrap gap-4">
              {[House, Search, Heart, CalendarDays, User, Settings, MapPin, SlidersHorizontal].map(
                (glyph, index) => (
                  <Icon key={index} icon={glyph} size={24} />
                )
              )}
            </View>
          </Section>

          <Section title="12. Segmented control">
            <SegmentedControl
              options={[
                { value: 'list', label: 'List', icon: List },
                { value: 'map', label: 'Map', icon: MapIcon },
              ]}
              value={view}
              onValueChange={setView}
            />
          </Section>

          <Section title="13. Toggles / Steppers">
            <View className="flex-row items-center gap-4">
              <Toggle value={toggleOn} onValueChange={setToggleOn} label="Instant book" />
              <Stepper value={guests} onValueChange={setGuests} min={1} max={16} label="Guests" />
            </View>
          </Section>

          <Section title="14. Status / Alerts">
            {alertVisible && (
              <Alert
                variant="success"
                message="Account created successfully"
                onDismiss={() => setAlertVisible(false)}
              />
            )}
            {errorVisible && (
              <Alert
                variant="error"
                message="Something went wrong. Please try again."
                onDismiss={() => setErrorVisible(false)}
              />
            )}
          </Section>

          <Section title="15. Tags / Badges">
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="guest-favorite" label="Guest favorite" icon={Star} />
              <Badge variant="new" label="New" />
              <Badge variant="discount" label="20% off" />
              <Badge variant="superhost" label="Superhost" />
            </View>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
