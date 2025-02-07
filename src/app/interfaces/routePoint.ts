import { RouteStep } from './routeStep';

export interface RoutePoint {
  destination: string;
  mode: 'DRIVING' | 'TRANSIT';
  specifyTime: boolean;
  arrivalTime?: Date;
  duration?: string;
  directionsRenderer?: google.maps.DirectionsRenderer;
  steps: RouteStep[];
}
