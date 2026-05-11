import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { getHistory, clearHistory } from '@/services/storageService';
import { AlarmHistoryEntry } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';

export default function HistoryScreen() {
  const C = useTheme();
  const [history, setHistory] = useState<AlarmHistoryEntry[]>([]);

  async function load() {
    setHistory(await getHistory());
  }

  useEffect(() => { load(); }, []);

  function handleClear() {
    Alert.alert('Clear History', 'Delete all history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  }

  function renderItem({ item }: { item: AlarmHistoryEntry }) {
    const reached = item.status === 'triggered';
    const date = new Date(item.resolvedAt);
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.card,
        borderRadius: RADIUS.lg,
        borderWidth: 0.5,
        borderColor: C.cardBorder,
        padding: SPACING.md,
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
      }}>
        <View style={{
          width: 36, height: 36,
          borderRadius: RADIUS.md,
          backgroundColor: reached
            ? 'rgba(48,209,88,0.12)'
            : 'rgba(255,69,58,0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Text style={{
            fontSize: 14,
            color: reached ? C.success : C.danger,
            fontWeight: '600',
          }}>
            {reached ? '✓' : '✕'}
          </Text>
        </View>

        <View style={{ flex: 1, gap: 3 }}>
          <Text style={{
            fontSize: 15, fontWeight: '600',
            color: C.text, letterSpacing: -0.2,
          }} numberOfLines={1}>
            {item.destinationLabel}
          </Text>
          <Text style={{ fontSize: 12, color: C.textSecondary }}>
            {dateStr} · {timeStr} · {item.radiusMeters}m
          </Text>
        </View>

        <Text style={{
          fontSize: 12, fontWeight: '600',
          color: reached ? C.success : C.textTertiary,
        }}>
          {reached ? 'Reached' : 'Cancelled'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>

      <View style={{
        paddingTop: 60, paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md, flexDirection: 'row',
        alignItems: 'baseline', justifyContent: 'space-between',
      }}>
        <Text style={{
          fontSize: 34, fontWeight: '700',
          color: C.text, letterSpacing: -0.8,
        }}>
          History
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={{ fontSize: 16, color: C.danger }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center',
          justifyContent: 'center', gap: SPACING.sm }}>
          <View style={{
            width: 72, height: 72, borderRadius: RADIUS.xl,
            backgroundColor: C.surface, borderWidth: 0.5,
            borderColor: C.surfaceBorder, alignItems: 'center',
            justifyContent: 'center', marginBottom: SPACING.sm,
          }}>
            <Text style={{ fontSize: 32 }}>📋</Text>
          </View>
          <Text style={{
            fontSize: 18, fontWeight: '600',
            color: C.text, letterSpacing: -0.3,
          }}>
            No history yet
          </Text>
          <Text style={{
            fontSize: 14, color: C.textSecondary,
            textAlign: 'center', paddingHorizontal: SPACING.xl,
          }}>
            Completed and cancelled alarms appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id + item.resolvedAt}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: SPACING.md,
            paddingTop: SPACING.sm,
            paddingBottom: 110,
          }}
        />
      )}

    </View>
  );
}