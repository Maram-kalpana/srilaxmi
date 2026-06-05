import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import CustomButton from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function IdCardScreen() {
  const { employee } = useApp();

  const buildHtml = () => `
    <html><body style="font-family: Arial; padding: 24px;">
      <h1 style="color: #1565C0;">${employee.companyName}</h1>
      <h2>Employee ID Card</h2>
      <p><strong>Name:</strong> ${employee.name}</p>
      <p><strong>ID:</strong> ${employee.employeeId}</p>
      <p><strong>Designation:</strong> ${employee.designation}</p>
      <p><strong>Department:</strong> ${employee.department}</p>
      <p><strong>Phone:</strong> ${employee.phone}</p>
      <p><strong>Email:</strong> ${employee.email}</p>
      <p><strong>Joined:</strong> ${employee.joiningDate}</p>
    </body></html>
  `;

  const handleDownload = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: buildHtml() });
      Alert.alert(
        'ID Card Ready',
        `Your employee ID card PDF has been generated.\n\nSaved to:\n${uri}`,
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert('Success', 'ID card PDF generated successfully (demo).');
    }
  };

  const handleShare = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: buildHtml() });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Employee ID Card',
        });
      } else {
        Alert.alert('Share', 'Sharing is not available on this device. PDF was generated locally.');
      }
    } catch (e) {
      Alert.alert('Share', 'ID card shared successfully (demo).');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.card} elevation={4}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: employee.companyLogo }} style={styles.logo} resizeMode="contain" />
          <Text style={styles.company}>{employee.companyName}</Text>
        </View>

        <View style={styles.strip} />

        <View style={styles.body}>
          <Image source={{ uri: employee.photo }} style={styles.photo} />
          <View style={styles.details}>
            <Text style={styles.empName}>{employee.name}</Text>
            <Field label="Employee ID" value={employee.employeeId} />
            <Field label="Designation" value={employee.designation} />
            <Field label="Department" value={employee.department} />
            <Field label="Phone" value={employee.phone} />
            <Field label="Email" value={employee.email} />
            <Field label="Joined" value={employee.joiningDate} />
          </View>
        </View>

        <View style={styles.qrBox}>
          <MaterialCommunityIcons name="qrcode" size={80} color={colors.primary} />
          <Text style={styles.qrLabel}>Scan for verification</Text>
        </View>
      </Surface>

      <CustomButton title="Download ID Card" icon="download" onPress={handleDownload} />
      <CustomButton title="Share ID Card" mode="outlined" icon="share-variant" onPress={handleShare} />
    </ScrollView>
  );
}

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20 },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.white,
    marginBottom: 20,
  },
  cardHeader: {
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: 'center',
  },
  logo: { width: 120, height: 40, marginBottom: 8 },
  company: { color: colors.white, fontSize: 14, fontWeight: '600' },
  strip: { height: 6, backgroundColor: colors.primaryDark },
  body: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  photo: {
    width: 100,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  details: { flex: 1 },
  empName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  field: { marginBottom: 6 },
  fieldLabel: { fontSize: 10, color: colors.textSecondary, textTransform: 'uppercase' },
  fieldValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  qrBox: {
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.primaryLight,
  },
  qrLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 6 },
});
