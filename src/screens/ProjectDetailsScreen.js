import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { colors, statusColors } from '../theme/colors';

export default function ProjectDetailsScreen({ route, navigation }) {
  const { project } = route.params;
  const statusColor = statusColors[project.status] || colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{project.name}</Text>
            <Chip
              style={{ backgroundColor: statusColor + '22' }}
              textStyle={{ color: statusColor, fontWeight: '600' }}
            >
              {project.status}
            </Chip>
          </View>
          <Detail icon="barcode" label="Project Code" value={project.code} />
          <Detail icon="text" label="Description" value={project.description} multiline />
          <Detail icon="account-tie" label="Client" value={project.client} />
          <Detail icon="calendar-start" label="Start Date" value={project.startDate} />
          <Detail icon="calendar-end" label="End Date" value={project.endDate} />
        </Card.Content>
      </Card>

      <CustomButton
        title="Add Daily Work Update"
        icon="clipboard-plus"
        onPress={() => navigation.navigate('AddWorkUpdate', { project })}
      />
    </ScrollView>
  );
}

function Detail({ icon, label, value, multiline }) {
  return (
    <View style={[styles.detail, multiline && styles.detailMultiline]}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20, paddingBottom: 32 },
  card: { borderRadius: 16, marginBottom: 20, backgroundColor: colors.white },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  detail: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailMultiline: { alignItems: 'flex-start' },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 15, color: colors.text, fontWeight: '500' },
});
