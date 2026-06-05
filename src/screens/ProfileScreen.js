import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-paper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { employee, logout, updateEmployeePhone, changePassword } = useApp();
  const [phone, setPhone] = useState(employee.phone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setPhone(employee.phone);
  }, [employee.phone]);

  const handleSavePhone = () => {
    if (!phone.trim()) {
      Alert.alert('Validation', 'Phone number is required.');
      return;
    }
    updateEmployeePhone(phone.trim());
    Alert.alert('Saved', 'Phone number updated.');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation', 'New passwords do not match.');
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (!result.success) {
      Alert.alert('Error', result.message);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Success', result.message);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <ReadOnlyField label="Employee ID" value={employee.employeeId} />
        </Card.Content>
      </Card>

      <Text style={styles.section}>Phone Number</Text>
      <CustomInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <CustomButton title="Update Phone" icon="phone" mode="outlined" onPress={handleSavePhone} />

      <Text style={styles.section}>Password</Text>
      <CustomInput
        label="Password"
        value="••••••"
        editable={false}
        secureTextEntry
      />

      <Text style={styles.section}>Change Password</Text>
      <CustomInput
        label="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <CustomInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <CustomInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <CustomButton title="Change Password" icon="lock-reset" onPress={handleChangePassword} />

      <CustomButton
        title="Logout"
        icon="logout"
        mode="outlined"
        color={colors.error}
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20, paddingBottom: 40 },
  card: { borderRadius: 16, marginBottom: 8, backgroundColor: colors.white },
  field: { paddingVertical: 4 },
  fieldLabel: { fontSize: 12, color: colors.textSecondary },
  fieldValue: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 2 },
  section: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  logoutBtn: {
    marginTop: 24,
    borderColor: colors.error,
  },
});
