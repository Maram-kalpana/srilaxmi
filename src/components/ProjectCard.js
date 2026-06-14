import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors, statusColors } from '../theme/colors';

export default function ProjectCard({ project, onPress }) {
  const statusColor = statusColors[project.status] || colors.primary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.name}>{project.name}</Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: statusColor + '22',
                  borderColor: statusColor,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: statusColor }]}>
                {project.status}
              </Text>
            </View>
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
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 10,
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
});