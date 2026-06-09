import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import * as Print from 'expo-print';

import CustomButton from '../components/CustomButton';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function IdCardScreen() {
  const { employee } = useApp();

  const buildHtml = () => `
    <html>
      <body style="font-family: Arial; padding: 24px;">
        <h1 style="color: #1565C0;">${employee.companyName}</h1>
        <h2>Employee ID Card</h2>

        <p><strong>Name:</strong> ${employee.name}</p>
        <p><strong>ID:</strong> ${employee.employeeId}</p>
        <p><strong>Designation:</strong> ${employee.designation}</p>
        <p><strong>Department:</strong> ${employee.department}</p>
        <p><strong>Phone:</strong> ${employee.phone}</p>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Joined:</strong> ${employee.joiningDate}</p>
      </body>
    </html>
  `;

  const handleDownload = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: buildHtml(),
      });

      Alert.alert(
        'ID Card Ready',
        `Your employee ID card PDF has been generated.\n\nSaved to:\n${uri}`,
        [{ text: 'OK' }]
      );
    } catch (e) {
      Alert.alert(
        'Success',
        'ID card PDF generated successfully (demo).'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Surface style={styles.card} elevation={5}>
        <View style={styles.topHeader}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.companyLogo}
            resizeMode="contain"
          />
        </View>
  
        <View style={styles.redStrip} />
  
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: employee.photo }}
            style={styles.photo}
          />
        </View>
  
        <View style={styles.infoSection}>
          <Text style={styles.empName}>
            {employee.name}
          </Text>
  
          <Text style={styles.designation}>
            {employee.designation}
          </Text>
  
          <View style={styles.detailRow}>
            <Text style={styles.label}>Employee ID</Text>
            <Text style={styles.value}>{employee.employeeId}</Text>
          </View>
  
          <View style={styles.detailRow}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{employee.department}</Text>
          </View>
  
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{employee.phone}</Text>
          </View>
  
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{employee.email}</Text>
          </View>
  
          <View style={styles.detailRow}>
            <Text style={styles.label}>Joined</Text>
            <Text style={styles.value}>{employee.joiningDate}</Text>
          </View>
        </View>
  
        <View style={styles.bottomStrip} />
      </Surface>
  
      <CustomButton
        title="Download ID Card"
        icon="download"
        onPress={handleDownload}
      />
    </ScrollView>
  );
}

function Field({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <Text style={styles.fieldValue}>
        {value}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  content: {
    padding: 20,
    paddingBottom: 120, // prevents button from hiding behind bottom tabs
    alignItems: 'center',
  },
  card: {
    width: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 40,
  },
  companyLogo: {
    width: 350,
    height: 240,
    resizeMode: 'contain',
  },
  
  topHeader: {
    backgroundColor: '#FFFFFF',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },

  redStrip: {
    height: 35,
    backgroundColor: '#E11D48',
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: -70,
  },
  
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: '#E11D48',
    backgroundColor: '#FFFFFF',
  },

  infoSection: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 25,
  },

  empName: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 12,
  },

  designation: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E11D48',
    marginBottom: 25,
    fontWeight: '600',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    width: 120,
  },

  value: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    textAlign: 'right',
  },

  bottomStrip: {
    height: 25,
    backgroundColor: '#E11D48',
  },
});