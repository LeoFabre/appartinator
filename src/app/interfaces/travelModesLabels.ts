import { GoogleMapsLoaderService } from '../google-maps-loader.service';
import { BehaviorSubject } from 'rxjs';

export const travelModesLabels$ = new BehaviorSubject<{ label: string; value: google.maps.TravelMode }[]>([]);

export async function initializeTravelModes(loader: GoogleMapsLoaderService): Promise<void> {
  await loader.load();
  travelModesLabels$.next([
    { label: 'Driving 🚗', value: google.maps.TravelMode.DRIVING },
    { label: 'Walking 🚶', value: google.maps.TravelMode.WALKING },
    { label: 'Transit 🚇', value: google.maps.TravelMode.TRANSIT },
    { label: 'Biking 🚴', value: google.maps.TravelMode.BICYCLING },
  ]);
}

export function getTravelModeLabel(mode: google.maps.TravelMode): string {
  const modes = travelModesLabels$.getValue();
  return modes.find((travelMode) => travelMode.value === mode)?.label || 'Unknown';
}
