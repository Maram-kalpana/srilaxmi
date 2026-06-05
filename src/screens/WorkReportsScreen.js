import React, { useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Text, Card, IconButton, Chip } from 'react-native-paper';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, statusColors } from '../theme/colors';

function formatDuration(ms) {
  const s = Math.floor((ms || 0) / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function WorkReportsScreen() {
  const { workReports } = useApp();
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);

  const playAudio = async (item) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (playingId === item.id) {
        setPlayingId(null);
        return;
      }
      if (!item.recordingUri) {
        Alert.alert('No recording', 'This entry has no audio attached.');
        return;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: item.recordingUri });
      soundRef.current = sound;
      setPlayingId(item.id);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setPlayingId(null);
      });
      await sound.playAsync();
    } catch (e) {
      Alert.alert('Playback error', 'Could not play recording.');
      setPlayingId(null);
    }
  };

  if (workReports.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialCommunityIcons name="clipboard-text-off" size={64} color={colors.border} />
        <Text style={styles.emptyTitle}>No work reports yet</Text>
        <Text style={styles.emptyText}>
          Submit daily work updates from a project to see them here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subheader}>{workReports.length} entries</Text>
      <FlatList
        data={workReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const statusColor = statusColors[item.status] || colors.primary;
          return (
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <View style={styles.cardTop}>
                  <Text style={styles.date}>{item.date}</Text>
                  <Chip
                    compact
                    style={{ backgroundColor: statusColor + '22' }}
                    textStyle={{ color: statusColor, fontSize: 11 }}
                  >
                    {item.status}
                  </Chip>
                </View>
                <Text style={styles.project}>{item.projectName}</Text>
                <Text style={styles.workName}>{item.workName}</Text>
                <View style={styles.audioRow}>
                  <MaterialCommunityIcons name="waveform" size={20} color={colors.primary} />
                  <Text style={styles.audioMeta}>
                    Voice note · {formatDuration(item.durationMs)}
                  </Text>
                  <IconButton
                    icon={playingId === item.id ? 'pause' : 'play'}
                    size={22}
                    iconColor={colors.primary}
                    onPress={() => playAudio(item)}
                  />
                </View>
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  subheader: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { marginBottom: 12, borderRadius: 14, backgroundColor: colors.white },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  project: { fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: 4 },
  workName: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 8 },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  audioMeta: { flex: 1, fontSize: 13, color: colors.textSecondary },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
