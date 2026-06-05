import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../theme/colors';

export default function CustomButton({
  title,
  onPress,
  mode = 'contained',
  loading = false,
  disabled = false,
  icon,
  style,
  color,
}) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      icon={icon}
      buttonColor={mode === 'contained' ? color || colors.primary : undefined}
      textColor={mode === 'outlined' ? color || colors.primary : colors.white}
      style={[styles.button, style]}
      contentStyle={styles.content}
      labelStyle={styles.label}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginVertical: 6,
  },
  content: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
