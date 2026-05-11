import { Tabs } from 'expo-router';
import TabBar from '@/components/common/TabBar';

const TABS = [
  { name: 'home', label: 'Alarms', icon: '🔔' },
  { name: 'history', label: 'History', icon: '📋' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        // These two kill the default tab bar shadow/border completely
        tabBarShowLabel: false,
        tabBarItemStyle: { display: 'none' },
      }}
      tabBar={(props) => (
        <TabBar
          tabs={TABS}
          activeIndex={props.state.index}
          onPress={(i) => {
            props.navigation.navigate(props.state.routes[i].name);
          }}
        />
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="history" />
    </Tabs>
  );
}