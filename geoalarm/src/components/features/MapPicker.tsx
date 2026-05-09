import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, MapPressEvent, Marker } from 'react-native-maps';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapPickerProps {
  radiusMeters: number;
  onDestinationSet: (coord: Coordinate) => void;
}

export default function MapPicker({ radiusMeters, onDestinationSet }: MapPickerProps) {
  const [destination, setDestination] = useState<Coordinate | null>(null);

  function handleMapPress(e: MapPressEvent) {
    const coord = e.nativeEvent.coordinate;
    setDestination(coord);
    onDestinationSet(coord);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 17.3850,
          longitude: 78.4867,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        onPress={handleMapPress}
      >
        {destination && (
          <>
            <Marker
              coordinate={destination}
              title="Wake me up here"
            />
            <Circle
              center={destination}
              radius={radiusMeters}
              strokeColor="rgba(0,122,255,0.8)"
              fillColor="rgba(0,122,255,0.15)"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});