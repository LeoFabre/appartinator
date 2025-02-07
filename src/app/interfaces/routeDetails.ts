import { RouteStep } from './routeStep';

export interface RouteDetails {
  destination: string;
  mode: 'DRIVING' | 'TRANSIT';
  duration?: string;
  arrivalTime?: Date;
  steps: RouteStep[];
}
