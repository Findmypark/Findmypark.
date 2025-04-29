import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useState } from 'react';

export const DemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AlertCircle size={16} color={colors.white} />
      <Text style={styles.text}>
        We're launching soon!
      </Text>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => setDismissed(true)}
      >
        <X size={16} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    zIndex: 10,
  },
  text: {
    flex: 1,
    color: colors.white,
    fontSize: 12,
    marginLeft: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
});