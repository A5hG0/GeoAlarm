export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type AlarmStatus = "active" | "triggered" | "cancelled";

export interface Alarm {
  id: string;
  destination: Coordinate;
  destinationLabel: string;
  radiusMeters: number;
  isActive: boolean;
  status: AlarmStatus;
  createdAt: number;
  resolvedAt?: number;
}

export interface AlarmHistoryEntry {
  id: string;
  destination: Coordinate;
  destinationLabel: string;
  radiusMeters: number;
  status: "triggered" | "cancelled";
  createdAt: number;
  resolvedAt: number;
}
