import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

let NativeMapView = null;
let NativeMarker = null;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  NativeMapView = maps.default;
  NativeMarker = maps.Marker;
}

export default function AdaptiveMap({
  style,
  region,
  pickup,
  dropoff,
  driverLocation,
  onPressMap
}) {
  if (Platform.OS === 'web') {
    return (
      <View style={[style, styles.webBox]}>
        <Text style={styles.webTitle}>Web xarita fallback rejimi</Text>
        <Text style={styles.webText}>
          Pickup: {pickup?.lat?.toFixed?.(5)}, {pickup?.lng?.toFixed?.(5)}
        </Text>
        <Text style={styles.webText}>
          Dropoff: {dropoff?.lat?.toFixed?.(5)}, {dropoff?.lng?.toFixed?.(5)}
        </Text>
        {driverLocation ? (
          <Text style={styles.webText}>
            Haydovchi: {driverLocation.latitude?.toFixed?.(5)}, {driverLocation.longitude?.toFixed?.(5)}
          </Text>
        ) : null}
      </View>
    );
  }

  if (!NativeMapView || !NativeMarker) {
    return (
      <View style={[style, styles.webBox]}>
        <Text style={styles.webText}>Xarita moduli yuklanmadi.</Text>
      </View>
    );
  }

  return (
    <NativeMapView style={style} region={region} initialRegion={region} onPress={onPressMap}>
      {pickup ? <NativeMarker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} title="Pickup" /> : null}
      {dropoff ? (
        <NativeMarker coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }} title="Dropoff" pinColor="blue" />
      ) : null}
      {driverLocation ? <NativeMarker coordinate={driverLocation} title="Haydovchi" pinColor="green" /> : null}
    </NativeMapView>
  );
}

const styles = StyleSheet.create({
  webBox: {
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  webTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B66',
    marginBottom: 8
  },
  webText: {
    color: '#2D4663',
    marginBottom: 4
  }
});
