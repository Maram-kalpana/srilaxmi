import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const MENU_ITEMS = [
  { key: 'IdCard', title: 'Download ID Card', icon: 'card-account-details', screen: 'IdCard' },
  { key: 'Projects', title: 'My Projects', icon: 'briefcase', tab: 'ProjectsTab' },
  { key: 'Reports', title: 'Work Reports', icon: 'file-document', tab: 'ReportsTab' },
];

export default function DashboardScreen({ navigation }) {
  const { employee } = useApp();

  const handleCardPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
      return;
    }
    if (item.tab) {
      navigation.getParent()?.navigate(item.tab);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Avatar.Image size={72} source={{ uri: employee.photo }} />
        <View style={styles.heroText}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>{employee.name}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.menuCard}
            onPress={() => handleCardPress(item)}
            activeOpacity={0.85}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={item.icon} size={28} color={colors.primary} />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20, paddingBottom: 32 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  heroText: { flex: 1 },
  welcome: { fontSize: 14, color: colors.textSecondary },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
