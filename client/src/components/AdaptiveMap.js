import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AdaptiveMap({ style }) {
  return (
    <View style={[style, styles.placeholder]}>
      <Text style={styles.text}>Xarita tez kunda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B66'
  }
});
