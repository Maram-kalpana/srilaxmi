import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native-paper';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const { login, validateCredentials } = useApp();

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const nextErrors = {};

    if (!employeeId.trim()) {
      nextErrors.employeeId = 'Employee ID is required';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!validateCredentials(employeeId, password)) {
      setErrors({
        employeeId: 'Invalid Employee ID',
        password: 'Invalid password',
      });
      return;
    }

    setErrors({});
    login();
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />
            
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>

            <Text style={styles.hint}>
              Demo: EMP001 / 123456
            </Text>

            <CustomInput
              label="Employee ID"
              value={employeeId}
              onChangeText={setEmployeeId}
              autoCapitalize="characters"
              error={errors.employeeId}
              left={<TextInput.Icon icon="card-account-details" />}
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              left={<TextInput.Icon icon="lock" />}
            />

            <CustomButton
              title="Login"
              onPress={handleLogin}
              icon="login"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -120,
  },

  logo: {
    width: 540,
    height: 270,
    resizeMode: 'contain',
    marginBottom: -85, // pulls Employee Portal closer to logo
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0A4EA3',
    textAlign: 'center',
    marginTop: -25, // moves title upward
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#0047AB',
    borderRadius: 25,
    padding: 24,
    marginTop: 5,

    shadowColor: '#0A4EA3',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  hint: {
    fontSize: 14,
    color: '#D6E4FF',
    marginBottom: 24,
  },
});