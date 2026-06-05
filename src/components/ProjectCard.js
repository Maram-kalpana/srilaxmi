import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, statusColors } from '../theme/colors';

export default function ProjectCard({ project, onPress }) {
  const statusColor = statusColors[project.status] || colors.primary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons name="office-building" size={28} color={colors.primary} />
            <View
              style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}
            >
              <Text style={[styles.badgeText, { color: statusColor }]}>{project.status}</Text>
            </View>
          </View>
          <Text style={styles.name}>{project.name}</Text>
          <Text style={styles.code}>{project.code}</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons name="account-tie" size={16} color={colors.textSecondary} />
            <Text style={styles.client}>{project.client}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: colors.white,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  code: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  client: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
