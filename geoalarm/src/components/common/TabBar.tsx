import { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/constants/theme';

interface Tab {
  name: string;
  label: string;
  icon: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeIndex: number;
  onPress: (index: number) => void;
}

const ISLAND_H = 64;
const PILL_H = 48;
const ISLAND_PADDING = 6;

export default function TabBar({ tabs, activeIndex, onPress }: TabBarProps) {
  const C = useTheme();
  const pillX = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;
  const tabWidthRef = useRef(0);

  function animateTo(index: number) {
    Animated.parallel([
      Animated.spring(pillX, {
        toValue: index * tabWidthRef.current,
        useNativeDriver: true,
        mass: 0.55,
        stiffness: 200,
        damping: 15,
      }),
      Animated.sequence([
        Animated.timing(pillScale, {
          toValue: 0.88,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(pillScale, {
          toValue: 1,
          useNativeDriver: true,
          mass: 0.4,
          stiffness: 260,
          damping: 11,
        }),
      ]),
    ]).start();
  }

  function handleLayout(e: any) {
    const totalW = e.nativeEvent.layout.width - ISLAND_PADDING * 2;
    tabWidthRef.current = totalW / tabs.length;
    pillX.setValue(activeIndex * tabWidthRef.current);
  }

  useEffect(() => {
    if (tabWidthRef.current > 0) animateTo(activeIndex);
  }, [activeIndex]);

  return (
    // Outer wrapper — positions island above bottom edge
    <View style={styles.wrapper} pointerEvents="box-none">
      <View
        style={[
          styles.island,
          {
            backgroundColor: C.tabBar,
            borderColor: C.tabBarBorder,
            shadowColor: C.text,
          },
        ]}
        onLayout={handleLayout}
      >
        {/* Sliding glossy pill */}
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: C.pill,
              borderColor: C.pillBorder,
              width: tabWidthRef.current > 0
                ? tabWidthRef.current
                : `${100 / tabs.length}%` as any,
              transform: [
                { translateX: pillX },
                { scaleX: pillScale },
                { scaleY: pillScale },
              ],
            },
          ]}
        />

        {/* Tab items */}
        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => onPress(i)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.icon,
                { opacity: isActive ? 1 : 0.38 },
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.label,
                {
                  color: isActive ? C.text : C.textSecondary,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: SPACING.lg,
    right: SPACING.lg,
    // Explicitly transparent — no background, no border
    backgroundColor: 'transparent',
  },
  island: {
    height: ISLAND_H,
    borderRadius: RADIUS.xl,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ISLAND_PADDING,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  pill: {
    position: 'absolute',
    left: ISLAND_PADDING,
    height: PILL_H,
    borderRadius: RADIUS.lg,
    borderWidth: 0.5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: PILL_H,
    gap: 3,
    zIndex: 1,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
});