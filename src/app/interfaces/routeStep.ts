export interface RouteStep {
  instruction: string;
  duration: string;
  distance: string;
  travelMode: google.maps.TravelMode;
  transitDetails?: {
    line: string;
    departureStop: string;
    departureTime: string;
    arrivalStop: string;
    arrivalTime: string;
  };
}
