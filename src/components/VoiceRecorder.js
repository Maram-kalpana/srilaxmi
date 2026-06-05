import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function VoiceRecorder({ recordingUri, durationMs, onRecordingChange }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localDuration, setLocalDuration] = useState(durationMs || 0);
  const soundRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setLocalDuration(durationMs || 0);
  }, [durationMs]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const requestPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Microphone access is needed to record voice notes.');
      return false;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    return true;
  };

  const startRecording = async () => {
    const ok = await requestPermission();
    if (!ok) return;

    try {
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      setLocalDuration(0);
      onRecordingChange?.({ uri: null, durationMs: 0 });

      const start = Date.now();
      timerRef.current = setInterval(() => {
        setLocalDuration(Date.now() - start);
      }, 200);
    } catch (e) {
      Alert.alert('Recording error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      const duration = status.durationMillis || localDuration;
      setRecording(null);
      setLocalDuration(duration);
      onRecordingChange?.({ uri, durationMs: duration });
    } catch (e) {
      Alert.alert('Recording error', 'Could not save recording.');
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
      await sound.playAsync();
    } catch (e) {
      Alert.alert('Playback error', 'Could not play recording.');
      setIsPlaying(false);
    }
  };

  const stopPlayback = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
  };

  const deleteRecording = async () => {
    await stopPlayback();
    setLocalDuration(0);
    onRecordingChange?.({ uri: null, durationMs: 0 });
  };

  return (
    <Surface style={styles.surface} elevation={1}>
      <Text style={styles.title}>Voice Reason</Text>
      <Text style={styles.subtitle}>Record your work reason instead of typing</Text>

      <View style={styles.durationBox}>
        <MaterialCommunityIcons name="microphone" size={22} color={colors.primary} />
        <Text style={styles.duration}>
          {isRecording ? 'Recording… ' : 'Duration: '}
          {formatDuration(localDuration)}
        </Text>
      </View>

      <View style={styles.controls}>
        {!isRecording ? (
          <IconButton
            icon="microphone"
            mode="contained"
            containerColor={colors.primary}
            iconColor={colors.white}
            size={28}
            onPress={startRecording}
            disabled={!!recordingUri && !isRecording}
          />
        ) : (
          <IconButton
            icon="stop"
            mode="contained"
            containerColor={colors.error}
            iconColor={colors.white}
            size={28}
            onPress={stopRecording}
          />
        )}

        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          mode="contained-tonal"
          iconColor={colors.primary}
          size={26}
          onPress={isPlaying ? stopPlayback : playRecording}
          disabled={!recordingUri}
        />

        <IconButton
          icon="delete"
          mode="contained-tonal"
          iconColor={colors.error}
          size={26}
          onPress={deleteRecording}
          disabled={!recordingUri}
        />
      </View>

      <Text style={styles.hint}>
        {recordingUri ? 'Recording saved. Tap play to listen or delete to re-record.' : 'Tap the mic to start recording.'}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  duration: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
