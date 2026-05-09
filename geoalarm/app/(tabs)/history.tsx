import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { getHistory, clearHistory } from '@/services/storageService';
import { AlarmHistoryEntry } from '@/types';
import { COLORS, SPACING } from '@/constants/theme';

export default function HistoryScreen() {
  const [history, setHistory] = useState<AlarmHistoryEntry[]>([]);

  async function load() {
    const data = await getHistory();
    setHistory(data);
  }

  useEffect(() => { load(); }, []);

  function handleClear() {
    Alert.alert('Clear History', 'Delete all alarm history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  }

  function renderItem({ item }: { item: AlarmHistoryEntry }) {
    const date = new Date(item.resolvedAt).toLocaleDateString();
    const time = new Date(item.resolvedAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.card}>
        <View style={[
          styles.statusBadge,
          item.status === 'triggered' ? styles.badgeTriggered : styles.badgeCancelled,
        ]}>
          <Text style={styles.badgeText}>
            {item.status === 'triggered' ? '✅ Reached' : '✕ Cancelled'}
          </Text>
        </View>
        <Text style={styles.cardLabel}>{item.destinationLabel}</Text>
        <Text style={styles.cardMeta}>Radius: {item.radiusMeters}m</Text>
        <Text style={styles.cardDate}>{date} at {time}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySubtitle}>
            Completed and cancelled alarms will appear here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id + item.resolvedAt}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearBtnText}>Clear History</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: 80 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: SPACING.xs,
  },
  badgeTriggered: { backgroundColor: '#E6F9EE' },
  badgeCancelled: { backgroundColor: '#FFF0F0' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardMeta: { fontSize: 12, color: COLORS.textSecondary },
  cardDate: { fontSize: 12, color: COLORS.textSecondary },
  clearBtn: {
    position: 'absolute',
    bottom: 24,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearBtnText: { color: 'white', fontSize: 15, fontWeight: '600' },
});