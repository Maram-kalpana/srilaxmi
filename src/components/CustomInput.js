import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { colors } from '../theme/colors';

export default function CustomInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  left,
  right,
  multiline = false,
  style,
  ...rest
}) {
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        secureTextEntry={!!secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        error={!!error}
        left={left}
        right={right}
        multiline={multiline}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        style={styles.input}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
