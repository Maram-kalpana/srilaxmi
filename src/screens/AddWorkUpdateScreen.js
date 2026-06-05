import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, Menu, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import VoiceRecorder from '../components/VoiceRecorder';
import { WORK_STATUS_OPTIONS } from '../data/projectData';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AddWorkUpdateScreen({ route, navigation }) {
  const { project } = route.params;
  const { addWorkReport } = useApp();

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [workName, setWorkName] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [menuVisible, setMenuVisible] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [durationMs, setDurationMs] = useState(0);
  const [errors, setErrors] = useState({});

  const handleRecordingChange = ({ uri, durationMs: dur }) => {
    setRecordingUri(uri);
    setDurationMs(dur);
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!workName.trim()) nextErrors.workName = 'Work name is required';
    if (!recordingUri) nextErrors.recording = 'Please record a voice reason';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    addWorkReport({
      date: formatDate(date),
      dateISO: date.toISOString(),
      projectId: project.id,
      projectName: project.name,
      workName: workName.trim(),
      status,
      recordingUri,
      durationMs,
    });

    Alert.alert('Success', 'Daily work update submitted successfully.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.projectLabel}>Project</Text>
      <Text style={styles.projectName}>{project.name}</Text>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selected) => {
            if (Platform.OS === 'android') setShowPicker(false);
            if (event.type === 'dismissed') {
              setShowPicker(false);
              return;
            }
            if (selected) setDate(selected);
            if (Platform.OS === 'ios') setShowPicker(false);
          }}
        />
      )}

      <CustomInput
        label="Work Name"
        value={workName}
        onChangeText={setWorkName}
        error={errors.workName}
      />

      <Text style={styles.label}>Status</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.statusBtn}
            textColor={colors.primary}
          >
            {status}
          </Button>
        }
      >
        {WORK_STATUS_OPTIONS.map((opt) => (
          <Menu.Item
            key={opt}
            onPress={() => {
              setStatus(opt);
              setMenuVisible(false);
            }}
            title={opt}
          />
        ))}
      </Menu>

      <VoiceRecorder
        recordingUri={recordingUri}
        durationMs={durationMs}
        onRecordingChange={handleRecordingChange}
      />
      {errors.recording ? <Text style={styles.error}>{errors.recording}</Text> : null}

      <CustomButton title="Submit Work Update" icon="check" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 20, paddingBottom: 40 },
  projectLabel: { fontSize: 12, color: colors.textSecondary },
  projectName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dateBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  dateText: { fontSize: 16, color: colors.text },
  statusBtn: {
    marginBottom: 16,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
});
