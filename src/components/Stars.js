import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme';

// Read-only when onChange is missing; otherwise a 1–5 picker.
const Stars = ({ value = 0, size = 16, onChange }) => (
  <View style={styles.row}>
    {[1, 2, 3, 4, 5].map((n) => {
      const name = value >= n ? 'star' : value >= n - 0.5 ? 'star-half' : 'star-outline';
      const icon = <Ionicons name={name} size={size} color={value >= n - 0.5 ? colors.accent : colors.border} />;
      return onChange ? (
        <TouchableOpacity key={n} onPress={() => onChange(n)} hitSlop={6} style={styles.touch}>
          {icon}
        </TouchableOpacity>
      ) : (
        <View key={n} style={styles.gap}>{icon}</View>
      );
    })}
  </View>
);

export default Stars;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  gap: { marginRight: 2 },
  touch: { marginRight: 8 },
});
