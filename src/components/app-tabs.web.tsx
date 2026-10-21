import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';

const routes = [
  { name: 'home', href: '/', label: 'Home' },
  { name: 'search', href: '/search', label: 'Search' },
  { name: 'trips', href: '/trips', label: 'Trips' },
  { name: 'profile', href: '/profile', label: 'Profile' },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          {routes.map((route) => (
            <TabTrigger key={route.name} name={route.name} href={route.href} asChild>
              <TabButton>{route.label}</TabButton>
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      className={`items-center rounded-full px-4 py-2 active:opacity-70 ${isFocused ? 'bg-primary' : ''}`}>
      <Text variant="caption" tone={isFocused ? 'ink' : 'muted'}>
        {children}
      </Text>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View
      {...props}
      className="absolute bottom-0 w-full flex-row justify-center p-4">
      <View className="flex-row items-center gap-2 rounded-full bg-glass px-4 py-2">
        {props.children}
      </View>
    </View>
  );
}
