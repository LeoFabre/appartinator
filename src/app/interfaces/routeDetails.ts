import { RouteStep } from './routeStep';

export interface RouteDetails {
  destination: string;
  mode: google.maps.TravelMode;
  duration?: string;
  arrivalTime?: Date;
  steps: RouteStep[];
}
