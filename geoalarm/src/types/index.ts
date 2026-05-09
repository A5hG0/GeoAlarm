export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Alarm {
  id: string;
  destination: Coordinate;
  destinationLabel: string;
  radiusMeters: number;
  isActive: boolean;
  createdAt: number;
}
