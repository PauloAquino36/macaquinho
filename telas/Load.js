import React from 'react';
import { StyleSheet, View, ColorValue } from 'react-native';

const LoadingSpinner = ({ color, testID }) => {
  return (
    <View style={styles.container} accessibilityRole='progressbar' testID={testID}>
      <View style={[styles.background, { borderColor: color }]} />
    </View>
  );
};

const height = 24;

const styles = StyleSheet.create({
  container: {
    width: height,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: height / 2,
    borderWidth: 4,
  },
});

export default LoadingSpinner;
