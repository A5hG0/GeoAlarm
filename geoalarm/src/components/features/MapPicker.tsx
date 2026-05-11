import { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import MapView, { Circle, MapPressEvent, Marker } from 'react-native-maps';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8492a6' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c44' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212135' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c5c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1b2a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e1e30' }] },
];

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapPickerProps {
  radiusMeters: number;
  onDestinationSet: (coord: Coordinate) => void;
  initialDestination?: Coordinate | null;
}

export default function MapPicker({
  radiusMeters,
  onDestinationSet,
  initialDestination = null,
}: MapPickerProps) {
  const [destination, setDestination] = useState<Coordinate | null>(initialDestination);
  const isDark = useColorScheme() === 'dark';

  function handleMapPress(e: MapPressEvent) {
    const coord = e.nativeEvent.coordinate;
    setDestination(coord);
    onDestinationSet(coord);
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: destination?.latitude ?? 17.3850,
          longitude: destination?.longitude ?? 78.4867,
          latitudeDelta: destination ? 0.02 : 0.05,
          longitudeDelta: destination ? 0.02 : 0.05,
        }}
        showsUserLocation
        customMapStyle={isDark ? DARK_MAP_STYLE : []}
        onPress={handleMapPress}
      >
        {destination && (
          <>
            <Marker
              coordinate={destination}
              draggable
              onDragEnd={(e) => {
                const coord = e.nativeEvent.coordinate;
                setDestination(coord);
                onDestinationSet(coord);
              }}
            />
            <Circle
              center={destination}
              radius={radiusMeters}
              strokeColor={isDark ? 'rgba(77,163,255,0.7)' : 'rgba(0,122,255,0.7)'}
              fillColor={isDark ? 'rgba(77,163,255,0.12)' : 'rgba(0,122,255,0.1)'}
              strokeWidth={1.5}
            />
          </>
        )}
      </MapView>
    </View>
  );
}