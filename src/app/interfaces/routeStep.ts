export interface RouteStep {
  instruction: string;
  duration: string;
  distance: string;
  travelMode: 'DRIVING' | 'TRANSIT';
  transitDetails?: {
    line: string;
    departureStop: string;
    departureTime: string;
    arrivalStop: string;
    arrivalTime: string;
  };
}
